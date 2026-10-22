import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft, FaLocationDot } from "react-icons/fa6";
import { FaWhatsapp } from "react-icons/fa";

import { siteConfig } from "@/config/site";
import { getPrimaryWhatsAppHref } from "@/lib/utils/whatsapp";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-background pt-20 text-white lg:pt-24"
    >
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
        className="absolute inset-0 -z-20 bg-[linear-gradient(to_left,rgba(5,7,11,0.88)_0%,rgba(5,7,11,0.64)_55%,rgba(5,7,11,0.28)_100%)] lg:bg-[linear-gradient(to_left,rgba(5,7,11,0.20)_0%,rgba(5,7,11,0.50)_40%,rgba(5,7,11,0.12)_75%,rgba(5,7,11,0.08)_100%)]"
      />

      <div
        aria-hidden="true"
        className="hero-bottom-fade pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-44 sm:h-36"
      />

      <div className="site-container relative py-16 sm:py-20 lg:py-24">
        <div className="max-w-2xl">
          <p className="mb-6 flex items-center gap-3 text-xs font-medium leading-6 text-[#E2B858] sm:text-sm">
            <span
              aria-hidden="true"
              className="h-px w-8 shrink-0 bg-[#E2B858]/70"
            />
            تأسيس · تشطيبات كهربائية · أنظمة ذكية
          </p>

          <h1
            id="hero-title"
            className="text-[clamp(2.25rem,5vw,4.25rem)] font-bold leading-[1.3] tracking-tight"
          >
            نوّر بيتك
            <span className="mt-2 block text-[#E2B858]">وكمّل حكاية ذوقك</span>
          </h1>

          <p className="mt-6 max-w-md text-sm leading-8 text-white/75 sm:text-base sm:leading-8">
            كل تفصيلة في بيتك تستاهل اختيار يليق بيها. مع الخولي، اكتشف إضاءة
            تبرز جمال المكان، وتشطيبات كهربائية تكمل أناقته، وحلول ذكية تضيف
            راحة ليومك.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href={getPrimaryWhatsAppHref()}
              target="_blank"
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-control bg-[#D6A744] px-6 py-3 text-sm font-semibold text-[#05070B] transition-colors duration-200 hover:bg-[#E2B858]"
            >
              <FaWhatsapp aria-hidden="true" className="size-5" />
              تواصل مع فريق الخولى{" "}
            </a>

            <Link
              href={"/products"}
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-control border border-white/25 bg-white/5 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition-colors duration-200 hover:border-white/50 hover:bg-white/10"
            >
              استكشف منتجاتنا
              <FaArrowLeft aria-hidden="true" className="size-4" />
            </Link>
          </div>

          <div className="mt-8 flex items-center gap-3 text-xs leading-6 text-white/60 sm:text-sm">
            <FaLocationDot
              aria-hidden="true"
              className="size-4 shrink-0 text-[#E2B858]/80"
            />
            <p>أو زورونا في معارض الخولي بدمنهور</p>
          </div>
        </div>
      </div>
    </section>
  );
}
