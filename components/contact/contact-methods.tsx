import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import {
  FaArrowLeft,
  FaArrowUpRightFromSquare,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa6";

import { routes } from "@/config/routes";
import { company } from "@/data/company";
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp";

const panelClassName =
  "flex min-w-0 flex-col rounded-3xl border border-border bg-surface p-6 sm:p-7";

const iconClassName =
  "mb-5 flex size-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/5 text-primary";

export function ContactMethods() {
  return (
    <section aria-labelledby="contact-methods-title" className="section-space">
      <div className="site-container">
        <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h2
            id="contact-methods-title"
            className="text-xl font-medium leading-8 text-foreground sm:text-2xl"
          >
            اختار الطريقة الأقرب لك.
          </h2>

          <Link
            href={routes.links}
            className="group inline-flex min-h-10 w-fit items-center gap-3 rounded-sm text-xs font-medium text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            كل الحسابات ووسائل التواصل
            <FaArrowLeft
              aria-hidden="true"
              className="size-3 transition-transform duration-200 motion-safe:group-hover:-translate-x-1 motion-reduce:transition-none"
            />
          </Link>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* WhatsApp contacts */}
          <article className="relative flex min-w-0 flex-col overflow-hidden rounded-3xl border border-primary/30 bg-primary/5 p-6 sm:p-7">
            <span aria-hidden="true" className={iconClassName}>
              <FaWhatsapp className="size-5" />
            </span>

            <h3 className="text-lg font-medium leading-8 text-foreground">
              نتكلم على واتساب
            </h3>

            <p className="mt-2 text-xs leading-7 text-muted">
              اختار جهة التواصل المناسبة، وابعت لنا سؤالك أو رابط المنتج اللي
              عجبك.
            </p>

            <ul className="mt-5 divide-y divide-primary/15">
              {company.whatsapp.map((contact, index) => (
                <li key={`${contact.number}-${index}`}>
                  <a
                    href={buildWhatsAppUrl(
                      contact.number,
                      "مرحبًا، أتواصل معكم من خلال موقع الخولي، وأود الاستفسار عن المنتجات.",
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex min-h-16 items-start justify-between gap-3 rounded-sm py-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <span className="min-w-0">
                      <span className="block break-words text-xs font-medium leading-6 text-foreground transition-colors group-hover:text-primary">
                        {contact.name}
                      </span>

                      {contact.label && (
                        <span className="mt-0.5 block text-[10px] leading-5 text-muted">
                          {contact.label}
                        </span>
                      )}

                      <span
                        dir="ltr"
                        className="mt-1 block w-fit text-xs font-medium leading-6 tabular-nums text-primary"
                      >
                        +{contact.number.replace(/\D/g, "")}
                      </span>
                    </span>

                    <span
                      aria-hidden="true"
                      className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full border border-primary/25 text-primary transition-colors group-hover:bg-primary group-hover:text-on-primary"
                    >
                      <FaArrowUpRightFromSquare className="size-3" />
                    </span>

                    <span className="sr-only">
                      محادثة واتساب — يفتح في تبويب جديد
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </article>

          {/* Phone numbers */}
          <article className={panelClassName}>
            <span aria-hidden="true" className={iconClassName}>
              <FaPhone className="size-4" />
            </span>

            <h3 className="text-lg font-medium leading-8 text-foreground">
              تفضّل الاتصال؟
            </h3>

            <p className="mt-2 text-xs leading-7 text-muted">
              اختار جهة التواصل المناسبة واتصل بنا خلال مواعيد العمل.
            </p>

            <ul className="mt-5 divide-y divide-border">
              {company.phones.map((contact, index) => (
                <li key={`${contact.number}-${index}`}>
                  <a
                    href={`tel:${contact.number.replace(/[^\d+]/g, "")}`}
                    className="group flex min-h-14 flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-sm py-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <span className="min-w-0">
                      <span className="block text-xs font-medium leading-6 text-foreground">
                        {contact.name}
                      </span>

                      {contact.label && (
                        <span className="block text-[10px] leading-5 text-muted">
                          {contact.label}
                        </span>
                      )}
                    </span>

                    <span
                      dir="ltr"
                      className="text-xs font-medium tabular-nums text-primary transition-colors group-hover:text-primary-hover"
                    >
                      {contact.number}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </article>

          {/* Email */}
          <article className={panelClassName}>
            <span aria-hidden="true" className={iconClassName}>
              <FaEnvelope className="size-4" />
            </span>

            <h3 className="text-lg font-medium leading-8 text-foreground">
              راسلنا بالتفاصيل
            </h3>

            <p className="mt-2 text-xs leading-7 text-muted">
              للاستفسارات المفصّلة، ابعت لنا احتياجاتك وبيانات التواصل على
              البريد الإلكتروني.
            </p>

            <div className="mt-auto pt-6">
              <a
                href={`mailto:${company.email}`}
                className="inline-flex min-h-11 max-w-full items-center gap-3 rounded-sm text-xs font-medium text-primary transition-colors hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                <span dir="ltr" className="min-w-0 break-all leading-6">
                  {company.email}
                </span>

                <FaArrowLeft aria-hidden="true" className="size-3 shrink-0" />
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
