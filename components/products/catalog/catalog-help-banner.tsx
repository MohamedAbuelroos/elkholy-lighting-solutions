import { FaWhatsapp } from "react-icons/fa";
import { FaArrowLeft, FaMagnifyingGlass } from "react-icons/fa6";

import { LightTrails } from "@/components/ui/light-trails";
import { company } from "@/data/company";
import { routes } from "@/config/routes";
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp";

type CatalogHelpBannerProps = {
  categoryName?: string;
};

export function CatalogHelpBanner({ categoryName }: CatalogHelpBannerProps) {
  const officialContact = company.whatsapp.find(
    (contact) => contact.name === company.name,
  );

  const message = [
    "مرحبًا، أبحث عن منتج ولم أجده في كتالوج الخولي.",
    categoryName ? `الفئة: ${categoryName}` : null,
    "أرغب في الاستفسار عن الخيارات المتاحة.",
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  const contactHref = officialContact
    ? buildWhatsAppUrl(officialContact.number, message)
    : routes.links;

  return (
    <section
      aria-labelledby="catalog-help-title"
      className="bg-background pb-12 pt-4 sm:pb-16"
    >
      
      <div className="site-container">
        <div className="relative isolate overflow-hidden rounded-2xl border border-primary/20 bg-surface">
          <LightTrails variant="flow" className="pointer-events-none" />

          {/* Subtle accent line */}
          <span
            aria-hidden="true"
            className="absolute inset-y-6 start-0 w-px bg-gradient-to-b from-transparent via-primary to-transparent"
          />

          <div className="relative z-10 flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
            <div className="flex items-start gap-4">
              <span className="hidden size-12 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary sm:flex">
                <FaMagnifyingGlass aria-hidden="true" className="size-4" />
              </span>

              <div className="max-w-xl">
                <p className="mb-2 text-[11px] font-medium text-primary">
                  نساعدك تكمّل اختيارك
                </p>

                <h2
                  id="catalog-help-title"
                  className="text-xl font-semibold leading-8 text-foreground sm:text-2xl"
                >
                  مش لاقي المنتج اللي بتدور عليه؟
                </h2>

                <p className="mt-2 text-sm leading-7 text-muted">
                  ابعت لنا اسم المنتج أو صورته، وهنساعدك تستفسر عن الخيارات
                  المتاحة.
                </p>
              </div>
            </div>

            <a
              href={contactHref}
              target={officialContact ? "_blank" : undefined}
              rel={officialContact ? "noopener noreferrer" : undefined}
              aria-label={
                officialContact
                  ? "تواصل عبر واتساب للاستفسار عن منتج — يفتح في تبويب جديد"
                  : "عرض وسائل التواصل"
              }
              className="group inline-flex min-h-12 shrink-0 items-center justify-center gap-3 rounded-control bg-primary px-6 py-3 text-sm font-semibold text-on-primary transition-colors duration-200 hover:bg-primary-hover"
            >
              <FaWhatsapp aria-hidden="true" className="size-5" />

              <span>{officialContact ? "تواصل عبر واتساب" : "تواصل معنا"}</span>

              <FaArrowLeft
                aria-hidden="true"
                className="size-3.5 motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover:-translate-x-1"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
