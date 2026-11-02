import "server-only";

import { randomUUID } from "node:crypto";

type VerificationResult =
  | { ok: true }
  | { ok: false; reason: "challenge" | "configuration" | "unavailable" };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function verifyOrderTurnstile(token: unknown): Promise<VerificationResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  const allowedHosts = (process.env.TURNSTILE_ALLOWED_HOSTNAMES ?? "")
    .split(",").map((host) => host.trim().toLowerCase()).filter(Boolean);

  if (!secret || !siteKey || allowedHosts.length === 0 ||
    allowedHosts.some((host) => !/^[a-z0-9.-]+$/.test(host)) ||
    /^[123]x0/.test(secret) || /^[123]x0/.test(siteKey)) {
    // Official dummy keys are intentionally not allowed in this app flow.
    console.error("Turnstile configuration is missing or contains test keys.");
    return { ok: false, reason: "configuration" };
  }

  if (typeof token !== "string" || !token.trim() || token.length > 2048) {
    return { ok: false, reason: "challenge" };
  }

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret,
        response: token,
        // Each fresh token has a separate validation attempt.
        // Do not reuse the order submission key here.
        idempotency_key: randomUUID(),
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) return { ok: false, reason: "unavailable" };

    const validation: unknown = await response.json();
    if (!isRecord(validation)) return { ok: false, reason: "unavailable" };

    if (validation.success !== true) {
      const errors = Array.isArray(validation["error-codes"])
        ? validation["error-codes"]
        : [];
      if (errors.includes("missing-input-secret") || errors.includes("invalid-input-secret")) {
        console.error("Turnstile server credentials were rejected.");
        return { ok: false, reason: "configuration" };
      }
      return { ok: false, reason: "challenge" };
    }

    if (validation.action !== "order-submit" ||
      typeof validation.hostname !== "string" ||
      !allowedHosts.includes(validation.hostname.toLowerCase())) {
      return { ok: false, reason: "challenge" };
    }

    return { ok: true };
  } catch {
    // Never log a token, secret, customer details, or full verification body.
    console.error("Turnstile verification could not be completed.");
    return { ok: false, reason: "unavailable" };
  }
}
