import "server-only";

import { createHmac } from "node:crypto";
import { isIP } from "node:net";
import { headers } from "next/headers";

import { createOrdersServerClient } from "@/lib/supabase/orders-server";

type RequestScope = "submit-request" | "recover-request" | "track-request";

type RequestLimitResult =
  | { allowed: true; clientHash: string }
  | { allowed: false; message: string };

export function hashOrderRateLimitValue(kind: "ip" | "phone", value: string): string {
  const secret = process.env.ORDER_RATE_LIMIT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("Missing order rate-limit configuration.");
  }

  return createHmac("sha256", secret)
    .update(`elkholy:orders:rate-limit:v1:${kind}:${value}`)
    .digest("hex");
}

async function getClientHash(): Promise<string> {
  if (process.env.VERCEL === "1") {
    const requestHeaders = await headers();
    const forwarded = requestHeaders.get("x-vercel-forwarded-for")
      ?? requestHeaders.get("x-forwarded-for");
    const address = forwarded?.split(",")[0]?.trim().toLowerCase();

    if (!address || !isIP(address)) {
      throw new Error("Trusted client address is unavailable.");
    }

    return hashOrderRateLimitValue("ip", address);
  }

  // Ignore spoofable request headers on the local development server.
  if (process.env.NODE_ENV === "development") {
    return hashOrderRateLimitValue("ip", "local-development");
  }

  // A different hosting platform requires an explicit trusted-proxy policy.
  throw new Error("Unsupported order rate-limit environment.");
}

export async function checkOrderRequestLimit(scope: RequestScope): Promise<RequestLimitResult> {
  try {
    const clientHash = await getClientHash();
    const supabase = createOrdersServerClient();
    const { data, error } = await supabase.rpc("consume_order_rate_limit", {
      p_scope: scope,
      p_subject_hash: clientHash,
    });

    if (error) {
      console.error("Order rate-limit check failed", { code: error.code });
      return { allowed: false, message: "تعذّر التحقق من المحاولات حاليًا. حاول بعد قليل." };
    }

    const result = data?.[0];
    if (!result) {
      return { allowed: false, message: "تعذّر التحقق من المحاولات حاليًا. حاول بعد قليل." };
    }

    if (!result.allowed) {
      const seconds = Math.max(1, result.retry_after_seconds);
      return {
        allowed: false,
        message: `محاولات كثيرة خلال وقت قصير. انتظر نحو ${seconds} ثانية ثم حاول مرة أخرى.`,
      };
    }

    return { allowed: true, clientHash };
  } catch {
    // Do not log IP addresses, phone numbers, tokens or environment secrets.
    console.error("Order rate-limit configuration or connection failed.");
    return { allowed: false, message: "تعذّر التحقق من المحاولات حاليًا. حاول بعد قليل." };
  }
}
