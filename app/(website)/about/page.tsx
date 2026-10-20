import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";

import { company } from "@/data/company";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "من نحن | الخولي",
  description:
    "تعرّف على الخولي للإضاءة والأنظمة الذكية ومجالات المنتجات والحلول المتاحة.",
};

const areas = [
  "الإضاءة الداخلية والخارجية",
  "المفاتيح والتشطيبات الكهربائية",
  "الأنظمة والأقفال الذكية",
  "الأنظمة الصوتية",
];

export default function AboutPage() {
  return (
    <div className="bg-background pb-16 pt-28 lg:pt-36">
      <div className="site-container">
        <nav aria-label="مسار التنقل" className="mb-8 text-xs text-muted">
          <Link href="/" className="hover:text-primary">
            الرئيسية
          </Link>
          <span aria-hidden="true" className="mx-2">
            ›
          </span>
          <span aria-current="page" className="text-primary">
            من نحن
          </span>
        </nav>

        <section className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
          <div>
            <p className="mb-3 text-xs font-medium text-primary">
              تعرّف على الخولي
            </p>

            <h1 className="text-3xl font-semibold leading-[1.5] text-foreground sm:text-4xl">
              تفاصيل تكمل المكان،
              <span className="block text-primary">واختيارات تعبّر عنك.</span>
            </h1>

            <p className="mt-5 text-base leading-8 text-muted">
              {company.nameAr} في دمنهور، وجهتك لاستكشاف منتجات الإضاءة
              والتشطيبات الكهربائية والأنظمة الذكية والصوتية.
            </p>

            <p className="mt-3 text-sm leading-8 text-muted">
              نساعدك في التعرّف على الخيارات والمواصفات واختيار ما يتناسب مع
              احتياجات منزلك أو مشروعك.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex min-h-11 items-center gap-3 rounded-control bg-primary px-5 py-3 text-sm font-semibold text-on-primary hover:bg-primary-hover"
              >
                اكتشف المنتجات
                <FaArrowLeft aria-hidden="true" className="size-3" />
              </Link>

              <Link
                href="/links#branches"
                className="inline-flex min-h-11 items-center rounded-control border border-border px-5 py-3 text-sm text-foreground hover:border-primary"
              >
                زور معارضنا
              </Link>
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border">
            <Image
              src={siteConfig.hero.src}
              alt="صورة توضيحية لحلول الإضاءة"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </section>

        <section
          aria-labelledby="about-areas-title"
          className="mt-14 border-t border-border pt-10"
        >
          <h2
            id="about-areas-title"
            className="mb-6 text-2xl font-semibold text-foreground"
          >
            مجالات حلولنا
          </h2>

          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {areas.map((area, index) => (
              <li
                key={area}
                className="rounded-xl border border-border bg-surface p-5"
              >
                <span
                  aria-hidden="true"
                  className="text-xs tabular-nums text-primary"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <h3 className="mt-4 text-sm font-semibold leading-7 text-foreground">
                  {area}
                </h3>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
