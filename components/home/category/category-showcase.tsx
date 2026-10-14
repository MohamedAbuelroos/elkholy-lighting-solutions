import Image from "next/image";
import { FaArrowLeft } from "react-icons/fa6";

import { company } from "@/data/company";
import { getRootCategories } from "@/lib/queries/categories";
import { buildWhatsAppUrl, getPrimaryWhatsAppHref } from "@/lib/utils/whatsapp";

export async function CategoryShowcase() {
  const categories = await getRootCategories();

  if (categories.length === 0) return null;

  const officialContact = company.whatsapp.find(
    (contact) => contact.name === company.name,
  );

  return (
    <section
      id="categories"
      aria-labelledby="categories-title"
      className="section-space bg-background"
    >
      <div className="site-container">
        {/* Section heading */}
        <div className="mb-8 flex flex-col gap-5 lg:mb-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 flex items-center gap-3 text-xs font-medium text-primary sm:text-sm">
              <span aria-hidden="true" className="h-px w-8 bg-primary" />
              تفاصيل تصنع الفرق
            </p>

            <h2
              id="categories-title"
              className="text-4xl font-bold leading-[1.4] text-foreground sm:text-5xl"
            >
              لكل مساحة，
              <span className="mt-1 block text-primary">اضاءة تليق بها.</span>
            </h2>
          </div>

          <p className="max-w-md text-sm leading-7 text-muted">
            من الإضاءة والتشطيبات الكهربائية إلى الأنظمة الذكية والصوتية، اكتشف
            ما يناسب منزلك أو مشروعك.
          </p>
        </div>

        {/* RTL places the first, featured card on the right */}
        <div className="grid gap-4 md:grid-cols-2">
          {categories.map((category, index) => {
            const isLead = index === 0;

            const inquiryHref = officialContact
              ? buildWhatsAppUrl(
                  officialContact.number,
                  `مرحبًا، أود الاستفسار عن ${category.name_ar} من خلال موقع الخولي.`,
                )
              : getPrimaryWhatsAppHref();

            return (
              <a
                key={category.id}
                href={inquiryHref}
                aria-labelledby={`category-title-${category.id}`}
                aria-describedby={`category-action-${category.id}`}
                className={`group relative isolate [transform:translateZ(0)] flex flex-col justify-end overflow-hidden rounded-card border border-border bg-surface ${
                  isLead
                    ? "min-h-[380px] md:row-span-3 md:min-h-0"
                    : "min-h-[240px] md:min-h-[200px]"
                }`}
              >
                {category.image_path && (
                  <Image
                    src={category.image_path}
                    alt=""
                    fill
                    sizes="(min-width: 1280px) 600px, (min-width: 768px) 50vw, 100vw"
                    className="-z-20 object-cover transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.04] motion-reduce:transition-none"
                  />
                )}

                {/* Image contrast stays consistent in both themes */}
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute -inset-px -z-10 [transform:translateZ(0)] [backface-visibility:hidden] ${
                    isLead
                      ? "bg-gradient-to-t from-black/95 via-black/30 to-black/10"
                      : "bg-[linear-gradient(to_left,rgba(0,0,0,0.88),rgba(0,0,0,0.55)_60%,rgba(0,0,0,0.20))]"
                  }`}
                />

                {/* Card number and English name */}
                <div className="absolute inset-x-5 top-5 flex flex-col items-end gap-2">
                  <span
                    aria-hidden="true"
                    className="text-xs font-medium tabular-nums text-white/55"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {category.name_en && (
                    <p
                      dir="ltr"
                      className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#E2B858]"
                    >
                      {category.name_en}
                    </p>
                  )}
                </div>

                <div
                  className={
                    isLead
                      ? "px-6 pb-6 pt-20 lg:px-8 lg:pb-8"
                      : "px-5 pb-5 pt-20 lg:px-6 lg:pb-6"
                  }
                >
                  <h3
                    id={`category-title-${category.id}`}
                    className={`font-semibold leading-[1.4] text-white ${
                      isLead ? "text-3xl lg:text-4xl" : "text-xl lg:text-2xl"
                    }`}
                  >
                    {category.name_ar}
                  </h3>

                  {category.description_ar && (
                    <p
                      className={`mt-2 max-w-md text-sm leading-6 text-white/75 ${
                        isLead ? "" : "line-clamp-2"
                      }`}
                    >
                      {category.description_ar}
                    </p>
                  )}

                  <div
                    className={`flex items-center justify-between gap-3 ${
                      isLead ? "mt-6 border-t border-white/20 pt-4" : "mt-3"
                    }`}
                  >
                    <span
                      id={`category-action-${category.id}`}
                      className="text-xs font-medium text-white/85 sm:text-sm"
                    >
                      استفسر عن {category.name_ar}
                    </span>

                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/25 text-white transition-colors duration-200 group-hover:border-[#D6A744] group-hover:bg-[#D6A744] group-hover:text-[#05070B]">
                      <FaArrowLeft aria-hidden="true" className="size-3.5" />
                    </span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
