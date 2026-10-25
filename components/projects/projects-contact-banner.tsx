import { FaWhatsapp } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa6";

import { getPrimaryWhatsAppHref } from "@/lib/utils/whatsapp";

export function ProjectsContactBanner() {
  return (
    <section
      aria-labelledby="projects-contact-title"
      className="pb-10 sm:pb-14"
    >
      <div className="site-container">
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-surface px-6 py-7 sm:px-8 sm:py-8">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-6 start-0 w-px bg-primary/60"
          />

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
            <div className="max-w-xl">
              <h2
                id="projects-contact-title"
                className="text-xl font-medium leading-[1.7] text-foreground sm:text-2xl"
              >
                عجبتك التفاصيل؟
                <span className="block text-primary sm:inline">
                  {" "}
                  خلّينا نتكلم عن مساحتك.
                </span>
              </h2>

              <p className="mt-2 text-xs leading-7 text-muted sm:text-sm">
                تواصل مع فريق الخولي لاكتشاف الاختيارات المناسبة لمشروعك.
              </p>
            </div>

            <a
              href={getPrimaryWhatsAppHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-3 rounded-full bg-primary px-5 py-3 text-xs font-medium text-on-primary transition-colors duration-300 hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transition-none sm:w-fit"
            >
              <FaWhatsapp aria-hidden="true" className="size-5 shrink-0" />
              تحدث معنا عن مشروعك
              <FaArrowLeft
                aria-hidden="true"
                className="size-3 shrink-0 transition-transform duration-300 motion-safe:group-hover:-translate-x-1 motion-reduce:transition-none"
              />
              <span className="sr-only">عبر واتساب — يفتح في تبويب جديد</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
