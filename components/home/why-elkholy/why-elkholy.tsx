import { FaGem, FaLayerGroup, FaSliders, FaComments } from "react-icons/fa6";

const benefits = [
  {
    id: "quality",
    icon: FaGem,
    title: "جودة تهتم بالتفاصيل",
    description:
      "نختار منتجاتنا من أرقي العلامات التجارية لضمان الجودة والاستمرارية في الأداء، مع مراعاة التفاصيل التي تناسب مساحتك.",
  },
  {
    id: "variety",
    icon: FaLayerGroup,
    title: "خيارات متنوعة",
    description:
      "أكثر من 5000 وحدة إضاءة وقطعة تشطيب كهربائي تناسب جميع الأذواق والميزانيات.",
  },
  {
    id: "selection",
    icon: FaSliders,
    title: "اختيار يناسبك",
    description: "نساعدك على اختيار المنتجات التي تناسب طبيعة مساحتك، مع مراعاة الشكل والاستخدام اليومي.",
  },
  {
    id: "contact",
    icon: FaComments,
    title: "تواصل مباشر",
    description:
      "تواصل مع فريق الخولي للاستفسار عن المنتجات والمواصفات قبل الاختيار.",
  },
] as const;

export function WhyElkholy() {
  return (
    <section
      id="why-elkholy"
      aria-labelledby="why-elkholy-title"
      className="section-space border-t border-border bg-background"
    >
      <div className="site-container">
        {/* Section heading */}
        <div className="mx-auto mb-8 max-w-xl text-center sm:mb-10">
          <p className="mb-3 text-xs font-medium text-primary sm:text-sm">
            تفاصيل تصنع تجربة أفضل
          </p>

          <h2
            id="why-elkholy-title"
            className="text-4xl font-bold leading-[1.4] text-foreground sm:text-5xl"
          >
            لماذا <span className="text-primary">الخولي؟</span>
          </h2>

          <p className="mt-4 text-sm leading-7 text-muted">
            لأن اختيارك لا يتوقف عند شكل المنتج، بل يمتد إلى التفاصيل التي تناسب
            مساحتك.
          </p>
        </div>

        {/* Four compact cards */}
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <li
                key={benefit.id}
                className="rounded-2xl border border-border bg-surface p-5 lg:p-6"
              >
                <span className="mb-5 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon aria-hidden="true" className="size-4" />
                </span>

                <h3 className="text-base font-semibold leading-7 text-foreground">
                  {benefit.title}
                </h3>

                <p className="mt-2 text-sm leading-7 text-muted">
                  {benefit.description}
                </p>
              </li>
            );
          })}
        </ul>

        {/* Brand statement */}
        <div className="mt-12 border-t border-border pt-12 text-center sm:mt-16 sm:pt-16">
          <span
            aria-hidden="true"
            className="mx-auto mb-7 block h-8 w-px bg-primary/60"
          />

          <p className="mx-auto max-w-5xl text-2xl font-medium leading-[1.8] text-foreground sm:text-3xl lg:text-4xl">
            نؤمن أن الإضاءة لا تكشف المكان فحسب،
            <span className="text-primary"> بل تمنحه روحًا وهوية.</span>
          </p>

          <p
            dir="ltr"
            className="mt-6 text-[10px] font-medium tracking-[0.2em] text-muted sm:text-xs"
          >
            ELKHOLY LIGHTING SOLUTIONS
          </p>
        </div>
      </div>
    </section>
  );
}
