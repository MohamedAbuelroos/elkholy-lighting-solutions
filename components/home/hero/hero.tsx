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
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-background pt-20 text-white lg:pt-24"
    >
      {/* الصورة لا تنتظر أنيميشن الدخول. */}
      <Image
        src={siteConfig.hero.src}
        alt={siteConfig.hero.alt}
        fill
        preload
        sizes="100vw"
        className="-z-30 object-cover object-[25%_center] sm:object-center"
      />

      <div
        aria-hidden="true"
        className={`${styles.overlay} pointer-events-none absolute inset-0 -z-20`}
      />

      <div
        aria-hidden="true"
        className={`${styles.bottomFade} pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-28 sm:h-36`}
      />

      <div className="site-container relative py-14 sm:py-20 lg:py-20">
        <div className="max-w-[42rem]">
          <p
            className={`${styles.reveal} mb-6 flex items-center gap-3 text-[11px] font-medium leading-7 text-[#E2B858] sm:mb-7 sm:text-xs`}
          >
            <span
              aria-hidden="true"
              className="h-px w-8 shrink-0 bg-[#E2B858]/70"
            />
            تأسيس · تشطيبات كهربائية · أنظمة ذكية
          </p>

          <h1
            id="hero-title"
            style={{ animationDelay: "70ms" }}
            className={`${styles.reveal} text-[clamp(2.25rem,3.6vw,4.125rem)] font-bold leading-[1.5]`}
          >
            <span className="block">نوّر بيتك</span>

            <span className="mt-1 block text-[1em] text-[#E2B858]">
              وكمّل حكاية ذوقك.
            </span>
          </h1>

          <p
            style={{ animationDelay: "140ms" }}
            className={`${styles.reveal} mt-5 max-w-[29rem] text-sm font-normal leading-8 text-white/75 sm:mt-6 sm:text-base sm:leading-9`}
          >
            إضاءة تبرز جمال بيتك، وتشطيبات تكمل أناقته، وحلول ذكية تضيف راحة
            ليومك. اختيارات الخولي لكل تفصيلة في مساحتك.
          </p>

          <div
            style={{ animationDelay: "210ms" }}
            className={`${styles.reveal} mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4`}
          >
            <a
              href={getPrimaryWhatsAppHref()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="تواصل مع فريق الخولي عبر واتساب — يفتح في تبويب جديد"
              className="inline-flex min-h-13 items-center justify-center gap-3 rounded-full bg-[#D6A744] px-7 py-3.5 text-sm font-medium text-[#05070B] transition-colors duration-200 hover:bg-[#E2B858] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E2B858]"
            >
              <FaWhatsapp aria-hidden="true" className="size-5 shrink-0" />
              تواصل مع فريق الخولي
            </a>

            <Link
              href={routes.products}
              className="group inline-flex min-h-13 items-center justify-center gap-4 rounded-full border border-white/25 bg-white/5 px-7 py-3.5 text-sm font-medium text-white transition-colors duration-200 hover:border-[#E2B858]/60 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E2B858]"
            >
              استكشف منتجاتنا
              <FaArrowLeft
                aria-hidden="true"
                className="size-3.5 motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover:-translate-x-1"
              />
            </Link>
          </div>

          <div
            style={{ animationDelay: "280ms" }}
            className={`${styles.reveal} mt-7 sm:mt-8`}
          >
            <Link
              href={routes.branches}
              className="inline-flex min-h-10 items-center gap-2.5 text-[11px] leading-6 text-white/60 transition-colors hover:text-white sm:text-xs"
            >
              <FaLocationDot
                aria-hidden="true"
                className="size-3.5 shrink-0 text-[#E2B858]/80"
              />
              زور معارض الخولي بدمنهور
              <FaArrowLeft aria-hidden="true" className="size-2.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
