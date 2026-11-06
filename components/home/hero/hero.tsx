import Image from "next/image";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { FaArrowLeft, FaLocationDot } from "react-icons/fa6";

import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { getPrimaryWhatsAppHref } from "@/lib/utils/whatsapp";

import styles from "./hero.module.css";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-background pb-10 pt-28 text-white sm:pb-12 sm:pt-32 lg:pb-14 lg:pt-36"
    >
      <Image
        src={siteConfig.hero.src}
        alt={siteConfig.hero.alt}
        fill
        preload
        sizes="100vw"
        className={`${styles.image} -z-30 object-cover`}
      />

      <div
        aria-hidden="true"
        className={`${styles.overlay} pointer-events-none absolute inset-0 -z-20`}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-14 bg-gradient-to-t from-background to-transparent sm:h-20"
      />

      <div className="site-container relative w-full">
        <div className="max-w-xl lg:max-w-[49%] xl:max-w-[46%]">
          <p
            className={`${styles.reveal} mb-5 flex items-center gap-3 text-[10px] font-medium leading-7 text-[#E8CC91] sm:mb-6 sm:text-xs`}
          >
            <span
              aria-hidden="true"
              className="h-px w-7 shrink-0 bg-[#E2B858]/70 sm:w-9"
            />
            تأسيس · تشطيبات كهربائية · أنظمة ذكية
          </p>

          <h1
            id="hero-title"
            style={{ animationDelay: "80ms" }}
            className={`${styles.reveal} text-[clamp(2.25rem,4.1vw,4.5rem)] font-bold leading-[1.4]`}
          >
            <span className="block text-[#FAF6ED]">نوّر بيتك،</span>

            <span className="mt-1 block text-[#E2B858]">وكمّل حكاية ذوقك.</span>
          </h1>

          <p
            style={{ animationDelay: "160ms" }}
            className={`${styles.reveal} mt-5 max-w-[27rem] text-sm leading-8 text-white/75 sm:text-[15px] sm:leading-8`}
          >
            إضاءة تبرز جمال بيتك، وتشطيبات تكمل أناقته، وحلول ذكية تضيف راحة
            ليومك. اختيارات الخولي لكل تفصيلة في مساحتك.
          </p>

          <div
            style={{ animationDelay: "240ms" }}
            className={`${styles.reveal} mt-7 flex flex-col gap-3 min-[420px]:flex-row min-[420px]:flex-wrap sm:mt-8`}
          >
            <Link
              href={routes.products}
              className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-[#E2B858]/50 bg-[#D6A744] px-6 py-3 text-xs font-semibold text-[#17120A] transition-colors duration-200 hover:bg-[#E6BD65] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E2B858] sm:min-h-13 sm:px-7 sm:text-sm"
            >
              استكشف منتجاتنا
              <FaArrowLeft
                aria-hidden="true"
                className="size-3 shrink-0 motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover:-translate-x-1"
              />
            </Link>

            <a
              href={getPrimaryWhatsAppHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full border border-white/30 bg-black/10 px-6 py-3 text-xs font-medium text-white transition-colors duration-200 hover:border-white/50 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E2B858] sm:min-h-13 sm:text-sm"
            >
              <FaWhatsapp aria-hidden="true" className="size-4 shrink-0" />
              تواصل مع فريق الخولي
              <span className="sr-only">يفتح في تبويب جديد</span>
            </a>
          </div>

          <div
            style={{ animationDelay: "320ms" }}
            className={`${styles.reveal} mt-5 sm:mt-6`}
          >
            <Link
              href={routes.branches}
              className="inline-flex min-h-11 items-center gap-2.5 text-[11px] leading-6 text-white/75 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E2B858] sm:text-xs"
            >
              <FaLocationDot
                aria-hidden="true"
                className="size-3.5 shrink-0 text-[#E2B858]"
              />
              زور معارض الخولي بدمنهور
              <FaArrowLeft aria-hidden="true" className="size-2.5 shrink-0" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
