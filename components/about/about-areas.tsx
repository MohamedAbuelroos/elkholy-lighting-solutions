import Link from "next/link";
import {
  FaArrowLeft,
  FaLightbulb,
  FaPlug,
  FaSliders,
  FaVolumeHigh,
} from "react-icons/fa6";

import { routes } from "@/config/routes";

const areas = [
  {
    number: "01",
    icon: FaLightbulb,
    title: "الإضاءة",
    description:
      "إضاءة داخلية وخارجية، من النجف والأباليك إلى السبوتات والوحدات المعلّقة؛ لكل مساحة أجواؤها.",
  },
  {
    number: "02",
    icon: FaPlug,
    title: "التشطيبات الكهربائية",
    description:
      "مفاتيح وبرايز وتجهيزات كهربائية تكمل التصميم، مع خيارات تناسب طبيعة الاستخدام.",
  },
  {
    number: "03",
    icon: FaSliders,
    title: "الأنظمة والأقفال الذكية",
    description:
      "خيارات للتحكم بالإضاءة والأجهزة والدخول، لتتعرّف على ما يناسب احتياجات مساحتك.",
  },
  {
    number: "04",
    icon: FaVolumeHigh,
    title: "الأنظمة الصوتية",
    description:
      "سماعات وحلول صوتية للمنازل والمشروعات، مع توضيح المواصفات والخيارات المتاحة.",
  },
] as const;

export function AboutAreas() {
  return (
    <section
      aria-labelledby="about-areas-title"
      className="section-space bg-background"
    >
      <div className="site-container">
        <div className="mb-8 flex flex-col gap-5 sm:mb-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-4 text-xs font-medium text-primary">مجالاتنا</p>

            <h2
              id="about-areas-title"
              className="text-[clamp(1.75rem,3vw,2.5rem)] font-medium leading-[1.65] text-foreground"
            >
              اختيارات مختلفة.
              <span className="block text-primary">رؤية واحدة للمكان.</span>
            </h2>
          </div>

          <Link
            href={routes.products}
            className="group inline-flex min-h-11 w-fit items-center gap-4 rounded-full border border-border bg-surface px-5 text-xs font-medium text-foreground transition-colors duration-300 hover:border-primary/50 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transition-none"
          >
            استكشف المنتجات
            <FaArrowLeft
              aria-hidden="true"
              className="size-3 transition-transform duration-300 motion-safe:group-hover:-translate-x-1 motion-reduce:transition-none"
            />
          </Link>
        </div>

        <ul className="grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-2">
          {areas.map((area) => {
            const Icon = area.icon;

            return (
              <li
                key={area.number}
                className="group/area bg-surface p-6 transition-colors duration-300 hover:bg-surface-elevated motion-reduce:transition-none sm:p-8"
              >
                <div className="flex items-start justify-between gap-5">
                  <span
                    aria-hidden="true"
                    className="flex size-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/5 text-primary"
                  >
                    <Icon className="size-[18px]" />
                  </span>

                  <span
                    aria-hidden="true"
                    className="text-[11px] tabular-nums tracking-widest text-muted/60"
                  >
                    {area.number}
                  </span>
                </div>

                <h3 className="mt-6 text-lg font-medium leading-8 text-foreground transition-colors duration-300 group-hover/area:text-primary motion-reduce:transition-none">
                  {area.title}
                </h3>

                <p className="mt-3 max-w-lg text-sm leading-8 text-muted">
                  {area.description}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
