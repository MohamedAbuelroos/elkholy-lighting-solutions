import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft, FaChevronLeft } from "react-icons/fa6";

import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";

export function AboutHero() {
  return (
    <section
      aria-labelledby="about-title"
      className="pb-12 pt-28 sm:pb-16 lg:pt-36"
    >
      <div className="site-container">
        <nav aria-label="مسار التنقل" className="mb-8 sm:mb-10">
          <ol className="flex items-center gap-3 text-xs leading-6 text-muted">
            <li>
              <Link
                href={routes.home}
                className="transition-colors hover:text-primary"
              >
                الرئيسية
              </Link>
            </li>

            <li aria-hidden="true">
              <FaChevronLeft className="size-2" />
            </li>

            <li aria-current="page" className="text-primary">
              من نحن
            </li>
          </ol>
        </nav>

        <div className="grid items-center gap-9 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
          <div className="min-w-0 lg:py-6">
            <p className="mb-5 flex items-center gap-3 text-xs font-medium text-primary">
              <span aria-hidden="true" className="h-px w-8 bg-primary/70" />
              الخولي · منذ 2005
            </p>

            <h1
              id="about-title"
              className="text-[clamp(2rem,4vw,3.5rem)] font-medium leading-[1.6] text-foreground"
            >
              للمكان تفاصيل،
              <span className="block text-primary">وللاختيار حكاية.</span>
            </h1>

            <p className="mt-6 max-w-lg text-sm leading-8 text-muted sm:text-base sm:leading-9">
              منذ 2005، نشارككم في دمنهور رحلة اختيار الإضاءة والتشطيبات
              الكهربائية. اختيارات تكمل جمال المكان، وتناسب تفاصيل الحياة داخله.
            </p>

            <Link
              href={routes.products}
              className="group mt-7 inline-flex min-h-12 items-center gap-5 rounded-full border border-primary/40 bg-primary/5 px-6 text-xs font-medium text-primary transition-colors duration-300 hover:bg-primary hover:text-on-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transition-none"
            >
              اكتشف عالم الخولي
              <FaArrowLeft
                aria-hidden="true"
                className="size-3 transition-transform duration-300 motion-safe:group-hover:-translate-x-1 motion-reduce:transition-none"
              />
            </Link>
          </div>

          <div className="relative min-w-0 pb-6 ps-6 sm:pb-8 sm:ps-8">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 top-8 rounded-3xl border border-primary/20"
            />

            <div className="relative isolate aspect-[5/4] overflow-hidden rounded-3xl bg-surface-elevated lg:aspect-[4/5] lg:max-h-[560px]">
              <Image
                src={siteConfig.hero.src}
                alt={siteConfig.hero.alt}
                fill
                preload
                sizes="(min-width: 1360px) 640px, (min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />

              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"
              />

              <div className="absolute inset-x-6 bottom-6 flex items-end justify-between gap-4 sm:inset-x-8 sm:bottom-8">
                <div>
                  <p className="text-[10px] font-medium text-[#E2B858]">
                    بداية الحكاية
                  </p>

                  <p
                    dir="ltr"
                    className="mt-2 text-5xl font-light leading-none tracking-tight text-white sm:text-6xl"
                  >
                    2005
                  </p>
                </div>

                <p className="max-w-32 text-xs leading-7 text-white/75">
                  اختيارات للمكان،
                  <br />
                  واهتمام بالتفاصيل.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
