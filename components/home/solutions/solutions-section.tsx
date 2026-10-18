import { FaArrowLeft, FaLightbulb, FaSliders, FaPlug } from "react-icons/fa6";
import { company } from "@/data/company";
import { buildWhatsAppUrl, getPrimaryWhatsAppHref } from "@/lib/utils/whatsapp";
import { LightTrails } from "@/components/ui/light-trails";

const solutions = [
  {
    id: "lighting",
    number: "01",
    icon: FaLightbulb,
    title: "إضاءة تكمل التصميم",
    description:
      "اكتشف وحدات الإضاءة التي تناسب طبيعة مساحتك، وتجمع بين الشكل والاستخدام اليومي.",
    tags: [
      "نجف مودرن وكلاسيك",
      "أباليك",
      "كشافات",
      "سبوتات",
      "إضاءة داخلية",
      "إضاءة خارجية",
      "إضاءة معلقة",
      "إضاءة ذكية",
    ],
    message: "مرحبًا، أود الاستفسار عن حلول الإضاءة المناسبة لمساحتي.",
  },
  {
    id: "electrical",
    number: "02",
    icon: FaPlug,
    title: "تفاصيل كهربائية متناسقة",
    description:
      "اختَر المفاتيح والبرايز والتشطيبات الكهربائية بما يتناسب مع احتياجاتك وطابع المكان.",
    tags: [
      "مفاتيح",
      "برايز",
      "تشطيبات كهربائية",
      "أوجه كهربائية",
      "لوحات كهربائية",
      "مفاتيح ذكية",
      "أنظمة صوتيه",
    ],
    message:
      "مرحبًا، أود الاستفسار عن المفاتيح والبرايز والتشطيبات الكهربائية.",
  },
  {
    id: "smart-home",
    number: "03",
    icon: FaSliders,
    title: "مساحة أكثر ذكاءً",
    description:
      "تعرّف على خيارات التحكم بالإضاءة والأقفال الذكية، واستفسر عن توافقها مع احتياجات مشروعك.",
    tags: ["تحكم بالإضاءة", "أقفال ذكية", "منزل ذكي"],
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
      <LightTrails variant="flow" />
      <div className="site-container relative z-10">
        <div className="mb-8 flex flex-col gap-5 lg:mb-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 flex items-center gap-3 text-xs font-medium text-primary sm:text-sm">
              <span aria-hidden="true" className="h-px w-8 bg-primary" />
              من المنتج إلى الحل
            </p>

            <h2
              id="solutions-title"
              className="text-4xl font-bold leading-[1.4] text-foreground sm:text-5xl"
            >
              حلول تناسب
              <span className="mt-1 block text-primary">تفاصيل مشروعك.</span>
            </h2>
          </div>

          <p className="max-w-md text-sm leading-7 text-muted">
            كل مساحة لها احتياجات مختلفة. اكتشف مجالات حلولنا، وتواصل معنا
            للاستفسار عن الخيارات المناسبة لك.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 lg:gap-5">
          {solutions.map((solution) => {
            const Icon = solution.icon;

            const inquiryHref = officialContact
              ? buildWhatsAppUrl(officialContact.number, solution.message)
              : getPrimaryWhatsAppHref();

            return (
              <article
                key={solution.id}
                aria-labelledby={`solution-title-${solution.id}`}
                className="flex h-full flex-col rounded-2xl border border-border bg-surface p-6 lg:p-7"
              >
                <div className="mb-7 flex items-center justify-between">
                  <span className="flex size-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>

                  <span
                    aria-hidden="true"
                    className="text-sm font-medium tabular-nums text-muted"
                  >
                    {solution.number}
                  </span>
                </div>

                <h3
                  id={`solution-title-${solution.id}`}
                  className="text-xl font-semibold leading-8 text-foreground"
                >
                  {solution.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-muted">
                  {solution.description}
                </p>

                <ul
                  aria-label="مجالات الحل"
                  className="mt-5 flex flex-wrap gap-2"
                >
                  {solution.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-border bg-surface-elevated px-3 py-1 text-[11px] leading-5 text-muted"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-7">
                  <a
                    href={inquiryHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`استفسر عن ${solution.title} عبر واتساب — يفتح في تبويب جديد`}
                    className="group flex min-h-11 items-center justify-between gap-3 border-t border-border pt-4 text-sm font-semibold text-primary"
                  >
                    استفسر الآن
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-primary/25 transition-colors group-hover:bg-primary group-hover:text-on-primary">
                      <FaArrowLeft aria-hidden="true" className="size-3.5" />
                    </span>
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
