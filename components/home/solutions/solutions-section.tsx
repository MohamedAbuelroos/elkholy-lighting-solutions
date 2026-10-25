import {
  FaArrowLeft,
  FaLightbulb,
  FaPlug,
  FaSliders,
} from "react-icons/fa6";

import { LightTrails } from "@/components/ui/light-trails";
import { company } from "@/data/company";
import {
  buildWhatsAppUrl,
  getPrimaryWhatsAppHref,
} from "@/lib/utils/whatsapp";

const solutions = [
  {
    id: "lighting",
    number: "01",
    icon: FaLightbulb,
    title: "إضاءة تكمل التصميم",
    description:
      "من قطعة تلفت الأنظار إلى إضاءة هادئة تصنع الأجواء، اختَر ما يبرز جمال مساحتك ويناسب استخدامك.",
    details: ["نجف وأباليك", "إضاءة داخلية وخارجية", "سبوتات وإضاءة معلّقة"],
    message: "مرحبًا، أود الاستفسار عن حلول الإضاءة المناسبة لمساحتي.",
  },
  {
    id: "electrical",
    number: "02",
    icon: FaPlug,
    title: "أناقة في كل تفصيلة",
    description:
      "مفاتيح وبرايز وتجهيزات كهربائية تتناسق مع التصميم، وتكمل المكان بجودة تلمسها في الاستخدام اليومي.",
    details: ["مفاتيح وبرايز", "أوجه وتشطيبات", "لوحات وتجهيزات كهربائية"],
    message:
      "مرحبًا، أود الاستفسار عن المفاتيح والبرايز والتشطيبات الكهربائية.",
  },
  {
    id: "smart-home",
    number: "03",
    icon: FaSliders,
    title: "راحة تتحكم فيها",
    description:
      "اكتشف خيارات التحكم بالإضاءة والأقفال والأنظمة الذكية، وتعرّف على ما يتوافق مع احتياجات منزلك أو مشروعك.",
    details: ["تحكم بالإضاءة", "أقفال ذكية", "أنظمة منزلية ذكية"],
    message: "مرحبًا، أود الاستفسار عن الأنظمة الذكية ومدى توافقها مع مشروعي.",
  },
] as const;

export function SolutionsSection() {
  const officialContact = company.whatsapp.find(
    (contact) => contact.name === company.name,
  );

  return (
    <section
      id="solutions"
      aria-labelledby="solutions-title"
      className="section-space relative isolate overflow-hidden border-t border-border bg-background"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40"
      >
        <LightTrails variant="arc" />
      </div>

      <div className="site-container relative">
        <div className="grid gap-9 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.45fr)] lg:gap-12 xl:gap-20">
          {/* Section introduction */}
          <div className="lg:py-7">
            <p className="mb-4 flex items-center gap-3 text-xs font-medium text-primary">
              <span
                aria-hidden="true"
                className="h-px w-8 shrink-0 bg-primary/70"
              />
              من المنتج إلى الحل
            </p>

            <h2
              id="solutions-title"
              className="text-[clamp(1.875rem,3vw,2.75rem)] font-bold leading-[1.55] text-foreground"
            >
              تفاصيل متناسقة.
              <span className="block text-primary">
                تجربة متكاملة.
              </span>
            </h2>

            <p className="mt-5 max-w-sm text-sm leading-8 text-muted">
              جمال المكان يبدأ باختيارات تعمل معًا. من الإضاءة إلى
              التشطيبات والأنظمة الذكية، نساعدك تتعرّف على الخيارات
              المناسبة لمساحتك.
            </p>

            <div className="mt-7 max-w-sm border-s border-primary/35 ps-4">
              <p className="text-xs leading-7 text-muted">
                بتجهّز بيتك أو بتخطّط لمشروع؟
                <span className="block font-medium text-foreground">
                  ابدأ باحتياجك، وخلّينا نفكّر معاك في التفاصيل.
                </span>
              </p>
            </div>
          </div>

          {/* Solution rows */}
          <div className="overflow-hidden rounded-3xl border border-border bg-surface">
            {solutions.map((solution, index) => {
              const Icon = solution.icon;

              const inquiryHref = officialContact
                ? buildWhatsAppUrl(
                    officialContact.number,
                    solution.message,
                  )
                : getPrimaryWhatsAppHref();

              return (
                <article
                  key={solution.id}
                  aria-labelledby={`solution-title-${solution.id}`}
                  className={`group/solution relative isolate p-5 transition-colors duration-300 hover:bg-surface-elevated focus-within:bg-surface-elevated motion-reduce:transition-none sm:p-7 ${
                    index !== 0 ? "border-t border-border" : ""
                  }`}
                >
                  {/* Subtle edge accent */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-6 start-0 w-px bg-primary opacity-0 transition-opacity duration-300 group-hover/solution:opacity-100 group-focus-within/solution:opacity-100 motion-reduce:transition-none"
                  />

                  <div className="flex items-start gap-4 sm:gap-5">
                    <div className="flex shrink-0 flex-col items-center gap-4">
                      <span
                        aria-hidden="true"
                        className="flex size-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/5 text-primary transition-colors duration-300 group-hover/solution:border-primary/40 group-hover/solution:bg-primary/10 motion-reduce:transition-none sm:size-12"
                      >
                        <Icon className="size-[18px]" />
                      </span>

                      <span
                        aria-hidden="true"
                        className="text-[10px] font-medium tabular-nums tracking-[0.12em] text-muted/70"
                      >
                        {solution.number}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3
                        id={`solution-title-${solution.id}`}
                        className="text-lg font-medium leading-8 text-foreground transition-colors duration-300 group-hover/solution:text-primary motion-reduce:transition-none sm:text-xl"
                      >
                        {solution.title}
                      </h3>

                      <p className="mt-2 max-w-lg text-xs leading-7 text-muted sm:text-sm">
                        {solution.description}
                      </p>

                      <ul
                        aria-label={`مجالات ${solution.title}`}
                        className="mt-4 flex flex-wrap gap-x-4 gap-y-2"
                      >
                        {solution.details.map((detail) => (
                          <li
                            key={detail}
                            className="flex items-center gap-2 text-[10px] leading-5 text-muted sm:text-[11px]"
                          >
                            <span
                              aria-hidden="true"
                              className="size-1 shrink-0 rounded-full bg-primary/60"
                            />
                            {detail}
                          </li>
                        ))}
                      </ul>

                      <a
                        href={inquiryHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`تحدث معنا عن ${solution.title} عبر واتساب — يفتح في تبويب جديد`}
                        className="group/link relative z-10 mt-4 inline-flex min-h-11 items-center gap-3 rounded-full text-xs font-medium text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                      >
                        تحدث معنا عن احتياجك

                        <span className="flex size-7 items-center justify-center rounded-full border border-primary/25 transition-colors duration-300 group-hover/link:border-primary group-hover/link:bg-primary group-hover/link:text-on-primary motion-reduce:transition-none">
                          <FaArrowLeft
                            aria-hidden="true"
                            className="size-2.5 transition-transform duration-300 motion-safe:group-hover/link:-translate-x-0.5 motion-reduce:transition-none"
                          />
                        </span>
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
