"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FaCartPlus, FaXmark } from "react-icons/fa6";

import { useCart } from "@/hooks/use-cart";

type AddToCartButtonProps = {
  productId: string;
  productName: string;
  quantity?: number;
  disabled?: boolean;
  className?: string;
};

type Feedback = {
  message: string;
  sequence: number;
};

const FEEDBACK_EVENT = "elkholy:cart-feedback";

export function AddToCartButton({
  productId,
  productName,
  quantity = 1,
  disabled = false,
  className = "",
}: AddToCartButtonProps) {
  const { addToCart } = useCart();

  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const sequenceRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Hide this notification when another cart button is used.
    function dismiss() {
      setFeedback(null);

      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }

    window.addEventListener(FEEDBACK_EVENT, dismiss);

    return () => {
      window.removeEventListener(FEEDBACK_EVENT, dismiss);

      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  function handleAdd() {
    const result = addToCart(productId, quantity);

    const messages = {
      added: `تمت إضافة ${quantity} من ${productName} إلى السلة.`,
      "quantity-limit": "الحد الأقصى لكل منتج هو 999 قطعة.",
      "cart-limit": "السلة تستوعب حتى 50 منتجًا مختلفًا.",
      invalid: "تعذّرت الإضافة. راجع الكمية وحاول مرة أخرى.",
    };

    window.dispatchEvent(new Event(FEEDBACK_EVENT));

    sequenceRef.current += 1;

    setFeedback({
      message: messages[result],
      sequence: sequenceRef.current,
    });

    timerRef.current = setTimeout(() => {
      setFeedback(null);
      timerRef.current = null;
    }, 3000);
  }

  function closeFeedback() {
    setFeedback(null);

    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  return (
    <div className={`min-w-0 ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={handleAdd}
        aria-label={`إضافة ${productName} إلى السلة`}
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-2.5 text-xs font-medium leading-6 text-primary transition-colors hover:border-primary hover:bg-primary hover:text-on-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none"
      >
        <FaCartPlus aria-hidden="true" className="size-4 shrink-0" />
        أضف إلى السلة
      </button>

      {feedback &&
        createPortal(
          <div
            dir="rtl"
            className="fixed inset-x-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-[100] mx-auto flex w-auto max-w-md items-center gap-3 rounded-2xl border border-primary/30 bg-surface p-4 text-foreground shadow-xl"
          >
            <FaCartPlus
              aria-hidden="true"
              className="size-5 shrink-0 text-primary"
            />

            <p
              role="status"
              aria-atomic="true"
              className="min-w-0 flex-1 break-words text-xs leading-7"
            >
              <span key={feedback.sequence}>{feedback.message}</span>
            </p>

            <button
              type="button"
              onClick={closeFeedback}
              aria-label="إغلاق الإشعار"
              className="flex size-9 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-elevated hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary"
            >
              <FaXmark aria-hidden="true" className="size-4" />
            </button>
          </div>,
          document.body,
        )}
    </div>
  );
}
