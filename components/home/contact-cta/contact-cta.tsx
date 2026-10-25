import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { FaArrowLeft, FaLocationDot } from "react-icons/fa6";

import { LightTrails } from "@/components/ui/light-trails";
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
        <div className="relative isolate overflow-hidden rounded-[2rem] border border-primary/20 bg-surface">
          {/* Quiet background detail */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 opacity-35"
          >
            <LightTrails variant="flow" />
          </div>

          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent sm:inset-x-16"
          />

          <div className="grid gap-8 px-6 py-9 sm:px-10 sm:py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)] lg:items-center lg:gap-12 lg:px-14 lg:py-16">
            {/* Closing message */}
            <div className="min-w-0">
              <p className="mb-5 flex items-center gap-3 text-xs font-medium text-primary">
                <span
                  aria-hidden="true"
                  className="h-px w-8 shrink-0 bg-primary/70"
                />
                من هنا تبدأ حكاية مساحتك
              </p>

              <h2
                id="contact-cta-title"
                className="text-[clamp(1.875rem,3.3vw,3rem)] font-medium leading-[1.6] text-foreground"
              >
                تخيّل المكان.
                <span className="block text-primary">ونختار تفاصيله معاك.</span>
              </h2>

              <p className="mt-5 max-w-lg text-sm leading-8 text-muted">
                بتجهّز بيتك أو بتخطّط لمشروع جديد؟ احكِ لنا عن مساحتك وما تبحث
                عنه، وخلّي فريق الخولي يساعدك تتعرّف على الاختيارات المناسبة.
              </p>
            </div>

            {/* Contact options */}
            <div className="min-w-0 border-t border-border pt-7 lg:border-s lg:border-t-0 lg:ps-9 lg:pt-0">
              <p className="text-sm font-medium leading-7 text-foreground">
                نبدأ بفكرة، أو بسؤال.
              </p>

              <p className="mt-1 text-xs leading-7 text-muted">
                فريقنا يسعده يسمع منك.
              </p>

              <a
                href={getPrimaryWhatsAppHref()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="تحدث مع فريق الخولي عبر واتساب — يفتح في تبويب جديد"
                className="group mt-5 flex min-h-13 w-full items-center justify-between gap-3 rounded-full bg-primary px-5 py-3 text-sm font-medium text-on-primary transition-colors duration-300 hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transition-none"
              >
                <span className="inline-flex items-center gap-3">
                  <FaWhatsapp aria-hidden="true" className="size-5 shrink-0" />
                  خلّينا نتكلم
                </span>

                <FaArrowLeft
                  aria-hidden="true"
                  className="size-3 shrink-0 transition-transform duration-300 motion-safe:group-hover:-translate-x-1 motion-reduce:transition-none"
                />
              </a>

              <Link
                href={routes.branches}
                className="group mt-3 flex min-h-12 w-full items-center justify-between gap-3 rounded-xl px-2 text-xs font-medium text-muted transition-colors duration-300 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none"
              >
                <span className="inline-flex items-center gap-2.5">
                  <FaLocationDot
                    aria-hidden="true"
                    className="size-3.5 shrink-0 text-primary"
                  />
                  أو زور معارضنا بدمنهور
                </span>

                <FaArrowLeft
                  aria-hidden="true"
                  className="size-3 shrink-0 transition-transform duration-300 motion-safe:group-hover:-translate-x-1 motion-reduce:transition-none"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
