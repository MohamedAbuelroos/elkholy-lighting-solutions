import { FaComments, FaGem, FaLayerGroup, FaSliders } from "react-icons/fa6";

import { LightTrails } from "@/components/ui/light-trails";

const benefits = [
  {
    id: "quality",
    number: "01",
    icon: FaGem,
    title: "جودة في التفاصيل",
    description:
      "نختار منتجاتنا بعناية، مع الاهتمام بالخامات وجودة الأداء والتفاصيل التي تكمل جمال المكان.",
  },
  {
    id: "variety",
    number: "02",
    icon: FaLayerGroup,
    title: "مساحة أوسع للاختيار",
    description:
      "إضاءة وتشطيبات وحلول ذكية بتصميمات متنوعة، لتجد ما يناسب ذوقك واحتياجات مساحتك.",
  },
  {
    id: "selection",
    number: "03",
    icon: FaSliders,
    title: "اختيار يناسبك",
    description:
      "نساعدك تقارن بين الخيارات، وتوازن بين الشكل والاستخدام اليومي قبل اتخاذ قرارك.",
  },
  {
    id: "contact",
    number: "04",
    icon: FaComments,
    title: "فريق تسمع منه",
    description:
      "تواصل مباشر مع فريق الخولي للإجابة عن أسئلتك وتوضيح المواصفات وتفاصيل المنتجات.",
  },
] as const;

export function WhyElkholy() {
  return (
    <section
      id="why-elkholy"
      aria-labelledby="why-elkholy-title"
      className="section-space relative isolate overflow-hidden border-t border-border bg-background"
    >
      <div className="site-container">
        {/* Introduction */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-4 flex items-center justify-center gap-3 text-xs font-medium text-primary">
            <span aria-hidden="true" className="h-px w-6 bg-primary/50" />
            تفاصيل تصنع تجربة أفضل
            <span aria-hidden="true" className="h-px w-6 bg-primary/50" />
          </p>

          <h2
            id="why-elkholy-title"
            className="text-[clamp(1.875rem,3vw,2.75rem)] font-bold leading-[1.55] text-foreground"
          >
            لماذا
            <span className="text-primary"> الخولي؟</span>
          </h2>

          <p className="mx-auto mt-4 max-w-lg text-sm leading-8 text-muted">
            لأن القطعة المناسبة لا تُختار بالشكل وحده. نهتم بما تراه، وما
            تستخدمه، والتفاصيل التي تعيش معها كل يوم.
          </p>
        </div>

        {/* One panel, four benefits */}
        <ul className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-border bg-border sm:mt-10 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <li
                key={benefit.id}
                className="group/benefit relative flex flex-col bg-surface p-6 transition-colors duration-300 hover:bg-surface-elevated motion-reduce:transition-none sm:p-7"
              >
                <div className="mb-7 flex items-center justify-between gap-4">
                  <span
                    aria-hidden="true"
                    className="flex size-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/5 text-primary transition-colors duration-300 group-hover/benefit:border-primary/40 group-hover/benefit:bg-primary/10 motion-reduce:transition-none"
                  >
                    <Icon className="size-[18px]" />
                  </span>

                  <span
                    aria-hidden="true"
                    className="text-[10px] font-medium tabular-nums tracking-[0.12em] text-muted/60"
                  >
                    {benefit.number}
                  </span>
                </div>

                <h3 className="text-base font-medium leading-7 text-foreground transition-colors duration-300 group-hover/benefit:text-primary motion-reduce:transition-none">
                  {benefit.title}
                </h3>

                <p className="mt-3 text-xs leading-7 text-muted">
                  {benefit.description}
                </p>

                <div aria-hidden="true" className="mt-auto pt-7">
                  <span className="block h-px w-8 bg-primary/40 transition-[width,background-color] duration-300 group-hover/benefit:bg-primary motion-safe:group-hover/benefit:w-14 motion-reduce:transition-none" />
                </div>
              </li>
            );
          })}
        </ul>

        {/* Brand statement */}
        <div className="relative isolate mt-10 overflow-hidden px-2 py-10 text-center sm:mt-12 sm:px-8 sm:py-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 opacity-40"
          >
            <LightTrails variant="flow" />
          </div>

          <div
            aria-hidden="true"
            className="mb-7 flex items-center justify-center gap-3"
          >
            <span className="h-px w-12 bg-gradient-to-l from-primary/50 to-transparent" />
            <span className="size-1.5 rotate-45 border border-primary/60" />
            <span className="h-px w-12 bg-gradient-to-r from-primary/50 to-transparent" />
          </div>

          <p className="mx-auto max-w-4xl text-[clamp(1.375rem,2.6vw,2.25rem)] font-medium leading-[1.9] text-foreground">
            نؤمن أن الإضاءة لا تكشف المكان فحسب،
            <span className="mt-1 block text-primary">
              بل تمنحه روحًا وهوية.
            </span>
          </p>

          <p
            dir="ltr"
            className="mt-7 text-[9px] font-medium leading-6 tracking-[0.22em] text-muted sm:text-[10px]"
          >
            ELKHOLY LIGHTING SOLUTIONS
          </p>
        </div>
      </div>
    </section>
  );
}
