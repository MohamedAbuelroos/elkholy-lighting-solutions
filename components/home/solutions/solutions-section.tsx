import { FaArrowLeft, FaLightbulb, FaPlug, FaSliders } from "react-icons/fa6";

import { LightTrails } from "@/components/ui/light-trails";
import { company } from "@/data/company";
import { buildWhatsAppUrl, getPrimaryWhatsAppHref } from "@/lib/utils/whatsapp";

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
        className="pointer-events-none absolute inset-0 -z-10 opacity-25"
      >
        <LightTrails variant="arc" />
      </div>

      <div className="site-container">
        {/* Introduction */}
        <div className="mb-9 grid gap-5 lg:mb-12 lg:grid-cols-[1.1fr_1fr] lg:items-end lg:gap-16">
          <div>
            <p className="mb-5 flex items-center gap-3 text-[11px] font-medium text-primary">
              <span
                aria-hidden="true"
                className="h-px w-9 shrink-0 bg-primary/70"
              />
              من المنتج إلى الحل
            </p>

            <h2
              id="solutions-title"
              className="text-[clamp(2rem,3.2vw,3rem)] font-semibold leading-[1.5] text-foreground"
            >
              تفاصيل متناسقة.
              <span className="block text-primary">تجربة متكاملة.</span>
            </h2>
          </div>

          <div className="max-w-md lg:justify-self-end">
            <p className="text-sm leading-8 text-muted">
              جمال المكان مش في قطعة واحدة، لكن في التفاصيل اللي تكمل بعضها.
              نساعدك تختار الإضاءة والتشطيبات والحلول الذكية المناسبة لمساحتك.
            </p>

            <p className="mt-3 text-xs leading-7 text-foreground">
              ابدأ باحتياجك، وخلّينا نفكّر معاك في التفاصيل.
            </p>
          </div>
        </div>

        {/* Solution cards */}
        <div className="grid items-stretch gap-4 sm:gap-5 lg:grid-cols-3 lg:gap-6 lg:pb-10">
          {solutions.map((solution, index) => {
            const Icon = solution.icon;

            const inquiryHref = officialContact
              ? buildWhatsAppUrl(officialContact.number, solution.message)
              : getPrimaryWhatsAppHref();

            const placementClass =
              index === 1
                ? "lg:translate-y-5"
                : index === 2
                  ? "lg:translate-y-10"
                  : "";

            return (
              <article
                key={solution.id}
                aria-labelledby={`solution-title-${solution.id}`}
                className={`group/solution relative isolate flex min-w-0 flex-col overflow-hidden rounded-[1.75rem] border border-border bg-surface p-6 transition-colors duration-300 hover:border-primary/45 focus-within:border-primary/45 motion-reduce:transition-none sm:p-7 xl:p-8 ${placementClass}`}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
                />

                <div
                  aria-hidden="true"
                  className="flex items-start justify-between gap-5"
                >
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/5 text-primary transition-colors duration-300 group-hover/solution:border-primary/40 group-hover/solution:bg-primary/10 motion-reduce:transition-none">
                    <Icon className="size-5" />
                  </span>

                  <span
                    dir="ltr"
                    className="select-none font-serif text-6xl leading-none tracking-tight text-primary/15 transition-colors duration-300 group-hover/solution:text-primary/25 motion-reduce:transition-none"
                  >
                    {solution.number}
                  </span>
                </div>

                <div className="mt-8">
                  <h3
                    id={`solution-title-${solution.id}`}
                    className="text-xl font-semibold leading-8 text-foreground sm:text-[22px]"
                  >
                    {solution.title}
                  </h3>

                  <p className="mt-3 text-sm leading-8 text-muted">
                    {solution.description}
                  </p>
                </div>

                <div className="mt-auto pt-6">
                  <ul
                    aria-label={`مجالات ${solution.title}`}
                    className="space-y-2.5 border-t border-border pt-5"
                  >
                    {solution.details.map((detail) => (
                      <li
                        key={detail}
                        className="flex items-center gap-3 text-[11px] leading-6 text-muted"
                      >
                        <span
                          aria-hidden="true"
                          className="h-px w-3 shrink-0 bg-primary/55"
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
                    className="group/link mt-6 flex min-h-12 items-center justify-between gap-4 rounded-xl border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-medium text-primary transition-colors duration-200 hover:border-primary/40 hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transition-none"
                  >
                    تحدث معنا عن احتياجك
                    <span
                      aria-hidden="true"
                      className="flex size-7 shrink-0 items-center justify-center rounded-full border border-primary/25 transition-colors duration-200 group-hover/link:border-primary group-hover/link:bg-primary group-hover/link:text-on-primary motion-reduce:transition-none"
                    >
                      <FaArrowLeft className="size-2.5 motion-safe:transition-transform motion-safe:group-hover/link:-translate-x-0.5" />
                    </span>
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        <p className="mt-6 text-center text-[11px] leading-7 text-muted lg:mt-9">
          بتجهّز بيتك أو بتخطّط لمشروع؟
          <span className="ms-1 text-foreground">
            خلّينا نساعدك تبدأ بالاختيارات المناسبة.
          </span>
        </p>
      </div>
    </section>
  );
}
