"use client";

import Link from "next/link";
import {
  useActionState,
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  useTransition,
} from "react";
import { FaWhatsapp } from "react-icons/fa";
import { FaArrowLeft, FaCheck, FaCopy } from "react-icons/fa6";

import { loadCartProducts } from "@/app/(website)/cart/actions";
import {
  recoverOrderSubmission,
  submitOrder,
} from "@/app/(website)/checkout/actions";
import { getProductPath, routes } from "@/config/routes";
import { useCart } from "@/hooks/use-cart";
import { consumeCartItems, type CartItem } from "@/lib/cart/store";
import {
  attemptToFormData,
  clearSavedCheckout,
  emptyCheckoutFields,
  readSavedCheckout,
  saveCheckout,
  type CheckoutAttempt,
  type CheckoutFields,
  type SavedCheckout,
} from "@/lib/orders/checkout-session";
import type {
  OrderFormState,
  OrderReceipt,
} from "@/lib/orders/order-form-types";
import { getPrimaryWhatsAppHref } from "@/lib/utils/whatsapp";
import { TurnstileWidget } from "@/components/security/turnstile-widget";
import { CustomerOrderReceipt } from "@/components/orders/customer-order-receipt";

type CartProducts = Awaited<ReturnType<typeof loadCartProducts>>;
type LoadedResult = { key: string; products: CartProducts; failed: boolean };
type CheckoutContentProps = { directItem?: CartItem | null };
const initialState: OrderFormState = {
  error: null,
  receipt: null,
  outcome: "idle",
};
const priceFormatter = new Intl.NumberFormat("ar-EG", {
  style: "currency",
  currency: "EGP",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});
const inputClassName =
  "mt-2 min-h-12 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 disabled:opacity-60";
const primaryButton =
  "inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-primary px-6 py-3 text-sm font-medium text-on-primary transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary disabled:cursor-wait disabled:opacity-60";
const secondaryButton =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-primary/30 px-5 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50";

function subscribeHydration() {
  return () => {};
}
function clientHydrationSnapshot() {
  return true;
}
function serverHydrationSnapshot() {
  return false;
}

function OrderSuccess({
  receipt,
  warning,
  onStartNew,
}: {
  receipt: OrderReceipt;
  warning: string;
  onStartNew: () => void;
}) {
  const [copyMessage, setCopyMessage] = useState("");
  const contactHref = getPrimaryWhatsAppHref();
  let whatsappHref = contactHref;
  if (contactHref.startsWith("https://wa.me/")) {
    const url = new URL(contactHref);
    url.searchParams.set(
      "text",
      [
        "مرحبًا فريق الخولي، أود متابعة طلبي المسجّل على الموقع:",
        "",
        `رقم الطلب: KH-${receipt.orderNumber}`,
        "",
        "برجاء مراجعة الطلب وتأكيد التوافر والأسعار النهائية وتفاصيل الاستلام.",
      ].join("\n"),
    );
    whatsappHref = url.toString();
  }

  async function copyTrackingCode() {
    try {
      await navigator.clipboard.writeText(receipt.trackingCode);
      setCopyMessage("تم نسخ كود التتبع.");
    } catch {
      setCopyMessage("تعذّر النسخ التلقائي. يمكنك تحديد الكود ونسخه يدويًا.");
    }
  }

  return (
    <section className="mx-auto max-w-2xl rounded-3xl border border-primary/20 bg-surface p-6 text-center sm:p-10">
      <CustomerOrderReceipt
        key={receipt.orderId}
        trackingCode={receipt.trackingCode}
      />
      <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <FaCheck aria-hidden="true" className="size-6" />
      </span>
      <h2 className="mt-6 text-2xl font-medium leading-relaxed text-foreground">
        استلمنا طلبك بنجاح
      </h2>
      <p className="mt-3 text-sm leading-8 text-muted">
        فريق الخولي هيراجع المنتجات ويتواصل معك لتأكيد التوافر والسعر النهائي
        وتفاصيل الاستلام.
      </p>
      <div className="mt-6 rounded-2xl border border-border bg-background p-5">
        <p className="text-xs text-muted">رقم الطلب</p>
        <p dir="ltr" className="mt-2 text-xl font-semibold text-primary">
          KH-{receipt.orderNumber}
        </p>
        <p className="mt-5 text-xs text-muted">احتفظ بكود التتبع التالي</p>
        <p
          dir="ltr"
          className="mt-3 select-all break-all font-mono text-sm leading-8 text-foreground"
        >
          {receipt.trackingCode}
        </p>
        <button
          type="button"
          onClick={copyTrackingCode}
          className={`mt-4 ${secondaryButton}`}
        >
          <FaCopy aria-hidden="true" className="size-3" />
          نسخ كود التتبع
        </button>
        <p role="status" className="mt-2 text-xs leading-7 text-muted">
          {copyMessage}
        </p>
      </div>
      <p className="mt-4 text-xs leading-7 text-muted">
        إرسال الطلب لا يعني إتمام الدفع أو تأكيد التوافر. احفظ كود التتبع قبل
        إغلاق التبويب.
      </p>
      {warning && (
        <p role="alert" className="mt-3 text-xs leading-7 text-foreground">
          {warning}
        </p>
      )}
      <div className="mt-6 flex flex-col items-center gap-3">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className={primaryButton}
        >
          <FaWhatsapp aria-hidden="true" className="size-5 shrink-0" />
          متابعة الطلب عبر واتساب
          <span className="sr-only">يفتح في تبويب جديد</span>
        </a>
        <p className="text-[11px] leading-7 text-muted">
          طلبك محفوظ بالفعل. يمكنك إرسال الرسالة للتواصل مع الفريق.
        </p>
        <Link href={routes.trackOrder} className={secondaryButton}>
          متابعة حالة الطلب
        </Link>
        <Link
          href={routes.products}
          className="inline-flex min-h-11 items-center gap-2 text-xs text-muted hover:text-primary"
        >
          متابعة الاستكشاف
          <FaArrowLeft aria-hidden="true" className="size-3" />
        </Link>
        <button
          type="button"
          onClick={onStartNew}
          className="min-h-11 text-xs text-muted underline underline-offset-4 hover:text-primary"
        >
          بدء طلب جديد
        </button>
      </div>
    </section>
  );
}

export function CheckoutContent({ directItem = null }: CheckoutContentProps) {
  const hydrated = useSyncExternalStore(
    subscribeHydration,
    clientHydrationSnapshot,
    serverHydrationSnapshot,
  );
  if (!hydrated)
    return (
      <p role="status" className="p-8 text-center text-sm text-muted">
        جارٍ تجهيز صفحة الطلب…
      </p>
    );
  return <CheckoutController directItem={directItem} />;
}

function CheckoutController({ directItem = null }: CheckoutContentProps) {
  const { items: cartItems } = useCart();
  const [boot] = useState(() => {
    try {
      return { saved: readSavedCheckout(), error: "" };
    } catch {
      return {
        saved: null,
        error:
          "تعذّر قراءة محاولة الطلب المحفوظة. لا تبدأ طلبًا آخر قبل مراجعة طلبك السابق مع الفريق أو السماح بتخزين بيانات هذا التبويب.",
      };
    }
  });
  const savedAttempt =
    boot.saved?.phase === "pending" ? boot.saved.attempt : null;
  const [attempt, setAttempt] = useState<CheckoutAttempt | null>(savedAttempt);
  const attemptRef = useRef<CheckoutAttempt | null>(savedAttempt);
  const [receipt, setReceipt] = useState<OrderReceipt | null>(
    boot.saved?.phase === "success" ? boot.saved.receipt : null,
  );
  const completedRef = useRef<OrderReceipt | null>(
    boot.saved?.phase === "success" ? boot.saved.receipt : null,
  );
  const [fields, setFields] = useState<CheckoutFields>(() =>
    savedAttempt ? { ...savedAttempt.fields } : { ...emptyCheckoutFields },
  );
  const [storageWarning, setStorageWarning] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [challengeVersion, setChallengeVersion] = useState(0);
  const handleTurnstileToken = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);
  const [result, setResult] = useState<LoadedResult>({
    key: "",
    products: [],
    failed: false,
  });
  const [retry, setRetry] = useState(0);
  const [productsPending, startProductTransition] = useTransition();
  const items = directItem ? [directItem] : cartItems;
  const idsKey = JSON.stringify(items.map((item) => item.productId).sort());
  const hasAttempt = attempt !== null;

  // A success receipt may have been saved immediately before a reload.
  // Cart receipt markers ensure applying it again does not consume twice.
  useEffect(() => {
    if (boot.saved?.phase === "success" && !boot.saved.isDirectOrder) {
      consumeCartItems(boot.saved.items, boot.saved.receipt.orderId);
    }
  }, [boot]);

  useEffect(() => {
    if (receipt || hasAttempt || boot.error) return;
    let cancelled = false;
    startProductTransition(async () => {
      try {
        const ids = JSON.parse(idsKey) as string[];
        const products = ids.length > 0 ? await loadCartProducts(ids) : [];
        if (!cancelled) setResult({ key: idsKey, products, failed: false });
      } catch {
        if (!cancelled) setResult({ key: idsKey, products: [], failed: true });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [idsKey, retry, receipt, hasAttempt, boot.error]);

  function updateField<K extends keyof CheckoutFields>(
    name: K,
    value: CheckoutFields[K],
  ) {
    setFields((previous) => ({ ...previous, [name]: value }));
  }

  function finishOrder(
    savedReceipt: OrderReceipt,
    savedAttempt: CheckoutAttempt,
  ) {
    const success: SavedCheckout = {
      version: 1,
      phase: "success",
      receipt: savedReceipt,
      items: savedAttempt.items,
      isDirectOrder: savedAttempt.isDirectOrder,
    };
    try {
      saveCheckout(success);
    } catch {
      setStorageWarning(
        "تم حفظ طلبك، لكن تعذّر حفظ نتيجته في التبويب. انسخ كود التتبع الآن.",
      );
    }
    completedRef.current = savedReceipt;
    setReceipt(savedReceipt);
    setAttempt(null);
    if (!savedAttempt.isDirectOrder)
      consumeCartItems(savedAttempt.items, savedReceipt.orderId);
  }

  async function handleAction(
    previousState: OrderFormState,
    data: FormData,
  ): Promise<OrderFormState> {
    // Repeated queued clicks must not create a fresh submission.
    if (completedRef.current)
      return { outcome: "success", error: null, receipt: completedRef.current };
    let current = attemptRef.current;
    const intent = data.get("intent");
    const token = turnstileToken;

    if (intent !== "recover" && !token) {
      return {
        outcome: "challenge-error",
        receipt: null,
        error: "أكمل التحقق قبل إرسال الطلب.",
      };
    }

    if (!current) {
      if (intent === "recover" || intent === "resume") {
        return {
          outcome: "editable-error",
          receipt: null,
          error: "لا توجد محاولة معلّقة للتحقق منها.",
        };
      }
      current = {
        key: crypto.randomUUID(),
        fields: { ...fields },
        items: items.map((item) => ({ ...item })),
        isDirectOrder: directItem !== null,
      };
      try {
        // Persist BEFORE making the network request.
        saveCheckout({ version: 1, phase: "pending", attempt: current });
      } catch {
        return {
          outcome: "editable-error",
          receipt: null,
          error:
            "تعذّر حفظ محاولة الطلب في هذا التبويب. اسمح بتخزين بيانات الموقع ثم حاول مجددًا. لم نرسل الطلب.",
        };
      }
      attemptRef.current = current;
      setAttempt(current);
    }

    let response: OrderFormState;
    try {
      if (intent === "recover") {
        setTurnstileToken("");
        setChallengeVersion((value) => value + 1);
        response = await recoverOrderSubmission(current.key);
      } else {
        // Token is ephemeral: never place it inside the saved attempt.
        const submissionData = attemptToFormData(current);
        submissionData.set("turnstile_token", token);
        setTurnstileToken("");
        setChallengeVersion((value) => value + 1);
        response = await submitOrder(previousState, submissionData);
      }
    } catch {
      response = {
        outcome: "uncertain",
        receipt: null,
        error:
          "تعذّر الاتصال لتأكيد نتيجة الطلب. بيانات المحاولة محفوظة؛ تحقّق من نتيجتها قبل بدء طلب آخر.",
      };
    }

    if (response.receipt) {
      finishOrder(response.receipt, current);
    } else if (response.outcome === "editable-error") {
      // The server confirmed this submission was rejected, not committed.
      try {
        clearSavedCheckout();
      } catch {
        /* The next write must still succeed before sending. */
      }
      setFields({ ...current.fields });
      attemptRef.current = null;
      setAttempt(null);
    }
    return response;
  }

  const [state, formAction, isPending] = useActionState(
    handleAction,
    initialState,
  );

  function startNewOrder() {
    try {
      clearSavedCheckout();
    } catch {
      setStorageWarning(
        "تعذّر بدء محاولة جديدة في هذا التبويب. احتفظ بكود طلبك الحالي أولًا.",
      );
      return;
    }
    attemptRef.current = null;
    completedRef.current = null;
    setAttempt(null);
    setReceipt(null);
    setFields({ ...emptyCheckoutFields });
    setStorageWarning("");
    setTurnstileToken("");
    setChallengeVersion((value) => value + 1);
    setRetry((value) => value + 1);
  }

  if (receipt)
    return (
      <OrderSuccess
        receipt={receipt}
        warning={storageWarning}
        onStartNew={startNewOrder}
      />
    );

  if (boot.error) {
    return (
      <section className="rounded-3xl border border-border bg-surface p-8 text-center">
        <p role="alert" className="text-sm leading-8">
          {boot.error}
        </p>
      </section>
    );
  }

  if (attempt) {
    return (
      <section
        aria-labelledby="pending-order-title"
        className="mx-auto max-w-2xl rounded-3xl border border-primary/25 bg-surface p-6 sm:p-8"
      >
        <h2
          id="pending-order-title"
          className="text-xl font-medium text-foreground"
        >
          {isPending ? "جارٍ التحقق من الطلب…" : "لديك محاولة طلب محفوظة"}
        </h2>
        <p className="mt-3 text-sm leading-8 text-muted">
          لن نبدأ طلبًا جديدًا قبل التأكد من نتيجة هذه المحاولة. يمكنك التحقق من
          الحفظ أو إعادة إرسال نفس البيانات بنفس معرّف المحاولة.
        </p>
        <p className="mt-3 text-xs leading-7 text-muted">
          المحاولة تحتوي على {attempt.items.length} منتج مختلف، للاستلام{" "}
          {attempt.fields.fulfillment_method === "delivery"
            ? "بالتوصيل"
            : "من المعرض"}
          .
        </p>
        {!isPending && (
          <div className="mt-5">
            <TurnstileWidget
              key={challengeVersion}
              onTokenChange={handleTurnstileToken}
            />
          </div>
        )}
        <form
          action={formAction}
          className="mt-5 flex flex-col gap-3 sm:flex-row"
        >
          <button
            type="submit"
            name="intent"
            value="recover"
            disabled={isPending}
            className={primaryButton}
          >
            التحقق من نتيجة الطلب
          </button>
          <button
            type="submit"
            name="intent"
            value="resume"
            disabled={isPending || !turnstileToken}
            className={secondaryButton}
          >
            إعادة إرسال نفس المحاولة
          </button>
        </form>
        <p role="status" className="mt-4 text-sm leading-8 text-foreground">
          {isPending ? "برجاء الانتظار…" : state.error}
        </p>
        <p className="mt-3 text-[11px] leading-7 text-muted">
          التحقق لا ينشئ طلبًا. إعادة الإرسال تسترجع الطلب الموجود، أو تحفظ نفس
          المحاولة إذا لم تكن قد وصلت.
        </p>
      </section>
    );
  }

  if (result.key !== idsKey || productsPending)
    return (
      <p role="status" className="p-10 text-center text-sm text-muted">
        جارٍ مراجعة منتجات الطلب…
      </p>
    );
  if (result.failed)
    return (
      <section className="rounded-3xl border border-border bg-surface p-8 text-center">
        <p role="alert" className="text-sm leading-8">
          تعذّر تحميل المنتجات. اختياراتك ما زالت محفوظة.
        </p>
        <button
          type="button"
          onClick={() => setRetry((value) => value + 1)}
          className={`mt-5 ${secondaryButton}`}
        >
          إعادة المحاولة
        </button>
      </section>
    );

  const productsById = new Map(
    result.products.map(({ product }) => [product.id, product]),
  );
  const unavailable = items.some((item) => !productsById.has(item.productId));
  if (items.length === 0 || unavailable)
    return (
      <section className="rounded-3xl border border-border bg-surface p-8 text-center">
        <h2 className="text-xl font-medium">
          {directItem
            ? "المنتج غير متاح حاليًا"
            : items.length === 0
              ? "السلة فارغة"
              : "راجع اختياراتك قبل إرسال الطلب"}
        </h2>
        <p className="mt-3 text-sm leading-8 text-muted">
          {state.error ??
            (unavailable
              ? "بعض المنتجات غير متاحة حاليًا. راجع اختياراتك قبل المتابعة."
              : "أضف المنتجات التي تحتاجها أولًا.")}
        </p>
        <Link
          href={directItem || items.length === 0 ? routes.products : "/cart"}
          className={`mt-5 ${secondaryButton}`}
        >
          {directItem || items.length === 0
            ? "استكشف المنتجات"
            : "العودة للسلة"}
        </Link>
      </section>
    );

  let subtotalInCents = 0;
  let unpricedCount = 0;
  for (const item of items) {
    const product = productsById.get(item.productId);
    if (!product) continue;
    if (product.sale_price === null) unpricedCount += 1;
    else
      subtotalInCents += Math.round(product.sale_price * 100) * item.quantity;
  }

  return (
    <form
      action={formAction}
      className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]"
    >
      <section className="min-w-0 rounded-3xl border border-border bg-surface p-5 sm:p-7">
        <h2 className="text-xl font-medium text-foreground">
          بيانات التواصل والاستلام
        </h2>
        <fieldset disabled={isPending} className="mt-6 min-w-0 space-y-5">
          <legend className="sr-only">بيانات العميل</legend>
          <div>
            <label htmlFor="customer_name" className="text-sm">
              الاسم
            </label>
            <input
              id="customer_name"
              name="customer_name"
              required
              minLength={2}
              maxLength={150}
              autoComplete="name"
              value={fields.customer_name}
              onChange={(event) =>
                updateField("customer_name", event.target.value)
              }
              className={inputClassName}
            />
          </div>
          <div>
            <label htmlFor="customer_phone" className="text-sm">
              رقم الموبايل
            </label>
            <input
              id="customer_phone"
              name="customer_phone"
              type="tel"
              dir="ltr"
              required
              maxLength={40}
              autoComplete="tel"
              placeholder="01012345678"
              value={fields.customer_phone}
              onChange={(event) =>
                updateField("customer_phone", event.target.value)
              }
              className={inputClassName}
            />
          </div>
          <fieldset>
            <legend className="text-sm">طريقة الاستلام</legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {(
                [
                  { value: "pickup", label: "استلام من المعرض" },
                  { value: "delivery", label: "توصيل للعنوان" },
                ] as const
              ).map((option) => (
                <label
                  key={option.value}
                  className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border p-4 text-xs ${fields.fulfillment_method === option.value ? "border-primary/40 bg-primary/5 text-primary" : "border-border text-foreground"}`}
                >
                  <input
                    type="radio"
                    name="fulfillment_method"
                    value={option.value}
                    checked={fields.fulfillment_method === option.value}
                    onChange={() =>
                      updateField("fulfillment_method", option.value)
                    }
                    className="size-4 accent-primary"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </fieldset>
          {fields.fulfillment_method === "delivery" && (
            <div className="space-y-5">
              <div>
                <label htmlFor="governorate" className="text-sm">
                  المحافظة
                </label>
                <input
                  id="governorate"
                  name="governorate"
                  required
                  maxLength={100}
                  autoComplete="address-level1"
                  value={fields.governorate}
                  onChange={(event) =>
                    updateField("governorate", event.target.value)
                  }
                  className={inputClassName}
                />
              </div>
              <div>
                <label htmlFor="city" className="text-sm">
                  المدينة أو المنطقة
                </label>
                <input
                  id="city"
                  name="city"
                  required
                  maxLength={150}
                  autoComplete="address-level2"
                  value={fields.city}
                  onChange={(event) => updateField("city", event.target.value)}
                  className={inputClassName}
                />
              </div>
              <div>
                <label htmlFor="address" className="text-sm">
                  العنوان بالتفصيل
                </label>
                <textarea
                  id="address"
                  name="address"
                  required
                  minLength={5}
                  maxLength={1000}
                  rows={3}
                  autoComplete="street-address"
                  value={fields.address}
                  onChange={(event) =>
                    updateField("address", event.target.value)
                  }
                  className={`${inputClassName} resize-y`}
                />
              </div>
            </div>
          )}
          <div>
            <label htmlFor="customer_notes" className="text-sm">
              ملاحظات — اختياري
            </label>
            <textarea
              id="customer_notes"
              name="customer_notes"
              maxLength={2000}
              rows={3}
              value={fields.customer_notes}
              onChange={(event) =>
                updateField("customer_notes", event.target.value)
              }
              className={`${inputClassName} resize-y`}
            />
          </div>
        </fieldset>
        {state.error && (
          <p
            role="alert"
            className="mt-6 rounded-2xl border border-primary/30 bg-primary/5 p-4 text-sm leading-8 text-foreground"
          >
            {state.error}
          </p>
        )}
        <p className="mt-4 text-[11px] leading-7 text-muted">
          عند الإرسال، نحتفظ ببيانات المحاولة في هذا التبويب حتى تتأكد نتيجتها.
          احفظ كود التتبع بعد نجاح الطلب.
        </p>
      </section>
      <aside className="min-w-0 rounded-3xl border border-primary/20 bg-surface p-5 sm:p-6 lg:sticky lg:top-28">
        <h2 className="text-lg font-medium text-foreground">
          مراجعة اختياراتك
        </h2>
        <ul className="mt-5 divide-y divide-border">
          {items.map((item) => {
            const product = productsById.get(item.productId);
            if (!product) return null;
            return (
              <li key={item.productId} className="py-3">
                <p className="break-words text-xs leading-7 text-foreground">
                  {product.name_ar}
                </p>
                <div className="mt-1 flex flex-wrap justify-between gap-2 text-[11px] leading-6 text-muted">
                  <span>الكمية: {item.quantity}</span>
                  <span>
                    {product.sale_price === null
                      ? "السعر عند الاستفسار"
                      : priceFormatter.format(
                          (Math.round(product.sale_price * 100) *
                            item.quantity) /
                            100,
                        )}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="mt-4 border-t border-border pt-4">
          <p className="text-xs leading-7 text-muted">
            {unpricedCount > 0
              ? "إجمالي المنتجات المسعّرة فقط"
              : "الإجمالي المبدئي"}
          </p>
          <p className="mt-2 break-words text-2xl font-medium text-foreground">
            {unpricedCount === items.length
              ? "السعر عند الاستفسار"
              : priceFormatter.format(subtotalInCents / 100)}
          </p>
        </div>
        <p className="mt-4 text-[11px] leading-7 text-muted">
          الأسعار المعروضة مبدئية ولا تشمل التوصيل. يراجع الفريق التوافر
          والأسعار النهائية ويتواصل معك قبل إتمام الطلب.
        </p>
        <div className="mt-5">
          <TurnstileWidget
            key={challengeVersion}
            onTokenChange={handleTurnstileToken}
          />
        </div>
        <button
          type="submit"
          name="intent"
          value="submit"
          disabled={isPending || !turnstileToken}
          className={`mt-5 w-full ${primaryButton}`}
        >
          {isPending
            ? "جارٍ تأكيد حفظ الطلب…"
            : unpricedCount > 0
              ? "إرسال طلب لتأكيد الأسعار"
              : "إرسال الطلب"}
        </button>
        <Link
          href={
            directItem && result.products[0]
              ? getProductPath(result.products[0].product.slug)
              : "/cart"
          }
          className="mt-3 flex min-h-11 items-center justify-center text-xs text-muted hover:text-primary"
        >
          {directItem ? "العودة للمنتج" : "العودة لتعديل السلة"}
        </Link>
      </aside>
    </form>
  );
}
