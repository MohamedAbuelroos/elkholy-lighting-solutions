import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { FaArrowLeft, FaLocationDot } from "react-icons/fa6";

import { routes } from "@/config/routes";
import { getPrimaryWhatsAppHref } from "@/lib/utils/whatsapp";

export function ContactCTA() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-cta-title"
      className="section-space border-t border-border bg-background"
    >
      <div className="site-container">
        <div className="relative isolate overflow-hidden rounded-3xl border border-primary/20 bg-surface px-6 py-12 sm:px-10 sm:py-16 lg:px-14">
          {/* Soft decoration */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,var(--color-primary),transparent_65%)] opacity-[0.08]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-28 -left-20 -z-10 size-72 rounded-full border border-primary/15 sm:size-96"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-36 -left-28 -z-10 size-96 rounded-full border border-primary/10 sm:size-[30rem]"
          />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
            <div className="max-w-xl">
              <p className="mb-4 flex items-center gap-3 text-xs font-medium text-primary sm:text-sm">
                <span aria-hidden="true" className="h-px w-8 bg-primary" />
                الخطوة الأولى تبدأ بتواصل
              </p>

              <h2
                id="contact-cta-title"
                className="text-3xl font-semibold leading-[1.5] text-foreground sm:text-4xl"
              >
                عندك مشروع؟
                <span className="mt-1 block text-primary">
                  خلّينا نساعدك تختار.
                </span>
              </h2>

              <p className="mt-4 max-w-lg text-sm leading-8 text-muted sm:text-base">
                احكِ لنا عن مساحتك وما تبحث عنه، وتواصل مع فريق الخولي للاستفسار
                عن المنتجات والحلول المناسبة.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 lg:max-w-xs">
              <a
                href={getPrimaryWhatsAppHref()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="تحدث معنا عن مشروعك عبر واتساب — يفتح في تبويب جديد"
                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-control bg-primary px-6 py-3 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover"
              >
                <FaWhatsapp aria-hidden="true" className="size-5" />
                تحدث معنا عن مشروعك
              </a>

              <Link
                href={routes.links}
                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-control border border-border bg-surface px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary/50 hover:bg-surface-elevated"
              >
                <FaLocationDot
                  aria-hidden="true"
                  className="size-4 text-primary"
                />
                زور معارضنا
                <FaArrowLeft aria-hidden="true" className="size-3.5" />
              </Link>

              <p className="mt-1 text-center text-xs leading-6 text-muted">
                تواصل عبر واتساب أو اعرف عناوين فروعنا بدمنهور
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
