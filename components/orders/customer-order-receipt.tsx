"use client";

import { useRef, useState } from "react";

import { loadCustomerReceipt } from "@/app/(website)/checkout/receipt-actions";
import { company } from "@/data/company";
import { siteConfig } from "@/config/site";
import type { CustomerReceipt } from "@/lib/orders/receipt-types";
import { printOrderReceipt, receiptStyles } from "@/lib/orders/receipt-print";

type CustomerOrderReceiptProps = {
  trackingCode: string;
};

const moneyFormatter = new Intl.NumberFormat("ar-EG", {
  style: "currency",
  currency: "EGP",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("ar-EG", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Africa/Cairo",
});

const buttonClassName =
  "inline-flex min-h-11 items-center justify-center rounded-full border border-primary/30 px-5 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/10 disabled:cursor-wait disabled:opacity-50";

export function CustomerOrderReceipt({
  trackingCode,
}: CustomerOrderReceiptProps) {
  const [receipt, setReceipt] = useState<CustomerReceipt | null>(null);
  const [loading, setLoading] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [error, setError] = useState("");

  const receiptRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  async function loadReceipt() {
    if (loadingRef.current) return;

    loadingRef.current = true;
    setLoading(true);
    setError("");

    try {
      const result = await loadCustomerReceipt(trackingCode);

      if (result.receipt) {
        setReceipt(result.receipt);
      } else {
        setError(result.error);
      }
    } catch {
      setError("تعذّر تحميل الإيصال. حاول مرة أخرى.");
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }

  async function handlePrint() {
    if (!receiptRef.current || !receipt || printing) return;

    setPrinting(true);
    setError("");

    try {
      await printOrderReceipt(receiptRef.current, receipt.orderNumber);
    } catch {
      setError(
        "تعذّر فتح الطباعة. اسمح بالنوافذ المنبثقة للموقع وحاول مرة أخرى.",
      );
    } finally {
      setPrinting(false);
    }
  }

  const items = receipt?.items ?? [];

  const pricedItems = items.filter((item) => item.line_total !== null);
  const unpricedCount = items.length - pricedItems.length;

  const subtotalInCents = pricedItems.reduce(
    (total, item) => total + Math.round((item.line_total ?? 0) * 100),
    0,
  );

  const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <section className=" min-w-0 text-start">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base font-medium text-foreground">إيصال الطلب</h3>

        {!receipt ? (
          <button
            type="button"
            onClick={loadReceipt}
            disabled={loading}
            className={buttonClassName}
          >
            {loading ? "جارٍ تحميل الإيصال…" : "عرض إيصال الطلب"}
          </button>
        ) : (
          <button
            type="button"
            onClick={handlePrint}
            disabled={printing}
            className={buttonClassName}
          >
            {printing ? "جارٍ تجهيز الطباعة…" : "طباعة / حفظ PDF"}
          </button>
        )}
      </div>

      {error && (
        <p role="alert" className="mt-3 text-xs leading-7 text-foreground">
          {error}
        </p>
      )}

      {receipt && (
        <>
          <p className="mt-3 text-xs leading-7 text-muted">
            لحفظ نسخة PDF، اضغط طباعة واختر «حفظ بصيغة PDF». يمكنك إلغاء رؤوس
            وتذييلات المتصفح من إعدادات الطباعة.
          </p>

          <style>{receiptStyles}</style>

          <div className="mt-5 min-w-0 overflow-hidden rounded-xl border border-border">
            <div ref={receiptRef} className="kh-receipt">
              <header className="kh-header">
                <div>
                  <p className="kh-brand" dir="ltr">
                    ELKHOLY
                  </p>
                  <p>{company.nameAr}</p>
                  <p className="kh-muted">{company.email}</p>
                  <p className="kh-muted" dir="ltr">
                    {siteConfig.url}
                  </p>
                </div>

                <div>
                  <h2>إيصال طلب</h2>
                  <p>
                    رقم الطلب: <bdi>KH-{receipt.orderNumber}</bdi>
                  </p>
                  <p>{dateFormatter.format(new Date(receipt.createdAt))}</p>
                  <p>الحالة: {receipt.statusLabel}</p>
                </div>
              </header>

              <div className="kh-details">
                <section className="kh-box">
                  <h3>بيانات العميل</h3>
                  <p>الاسم: {receipt.customerName}</p>
                  <p>
                    الموبايل: <bdi>{receipt.customerPhone}</bdi>
                  </p>
                </section>

                <section className="kh-box">
                  <h3>بيانات الاستلام</h3>
                  <p>
                    {receipt.fulfillmentMethod === "delivery"
                      ? "توصيل للعنوان"
                      : "استلام من المعرض"}
                  </p>

                  {receipt.fulfillmentMethod === "delivery" && (
                    <>
                      <p>
                        {receipt.governorate} — {receipt.city}
                      </p>
                      <p className="kh-notes">{receipt.address}</p>
                    </>
                  )}
                </section>
              </div>

              <h3>المنتجات المطلوبة</h3>

              <div className="kh-table-scroll">
                <table>
                  <caption className="sr-only">
                    المنتجات والأسعار المحفوظة وقت الطلب
                  </caption>

                  <thead>
                    <tr>
                      <th scope="col">المنتج / الكود</th>
                      <th scope="col">الكمية</th>
                      <th scope="col">السعر الأصلي</th>
                      <th scope="col">الخصم</th>
                      <th scope="col">سعر الوحدة</th>
                      <th scope="col">الإجمالي</th>
                    </tr>
                  </thead>

                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id}>
                        <th scope="row">
                          <p>{item.product_name}</p>
                          <p className="kh-muted">
                            <bdi>{item.product_sku ?? "بدون كود"}</bdi>
                          </p>
                        </th>

                        <td>{item.quantity}</td>

                        <td>
                          {item.original_unit_price === null
                            ? "غير محدد"
                            : moneyFormatter.format(item.original_unit_price)}
                        </td>

                        <td>{item.discount_percent}٪</td>

                        <td>
                          {item.unit_price === null
                            ? "عند الاستفسار"
                            : moneyFormatter.format(item.unit_price)}
                        </td>

                        <td>
                          {item.line_total === null
                            ? "غير محدد"
                            : moneyFormatter.format(item.line_total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="kh-summary">
                <p>
                  <span>عدد المنتجات المختلفة</span>
                  <span>{items.length}</span>
                </p>

                <p>
                  <span>إجمالي القطع</span>
                  <span>{totalQuantity}</span>
                </p>

                <p>
                  <span>تكلفة التوصيل</span>
                  <span>
                    {receipt.fulfillmentMethod === "delivery"
                      ? "تُحدد مع الفريق — غير مشمولة بالإجمالي"
                      : "استلام من المعرض"}
                  </span>
                </p>

                <p className="kh-total">
                  <span>
                    {unpricedCount > 0
                      ? "إجمالي المنتجات المسعّرة فقط"
                      : "الإجمالي المبدئي للمنتجات"}
                  </span>

                  <span>
                    {pricedItems.length === 0
                      ? "السعر عند الاستفسار"
                      : moneyFormatter.format(subtotalInCents / 100)}
                  </span>
                </p>

                {unpricedCount > 0 && (
                  <p className="kh-muted">
                    يوجد {unpricedCount} منتج بدون سعر محدد، وسيؤكد الفريق
                    أسعاره معك.
                  </p>
                )}
              </div>

              {receipt.customerNotes && (
                <section className="kh-notes kh-box">
                  <h3>ملاحظات العميل</h3>
                  <p>{receipt.customerNotes}</p>
                </section>
              )}

              <section className="kh-tracking kh-box">
                <h3>كود تتبع الطلب</h3>
                <p className="kh-code" dir="ltr">
                  {trackingCode}
                </p>
                <p className="kh-muted">
                  احتفظ بالكود بشكل خاص. استخدمه لمتابعة الطلب عبر الموقع.
                </p>
              </section>

              <footer className="kh-footer">
                <p>هذا إيصال لتسجيل طلبك، وليس فاتورة ضريبية أو إثبات دفع.</p>
                <p>
                  الأسعار والخصومات المعروضة محفوظة وقت إرسال الطلب. يؤكد الفريق
                  التوافر والأسعار النهائية وتكلفة التوصيل قبل إتمام الطلب.
                </p>
                <p>شكرًا لاختيارك الخولي.</p>
              </footer>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
