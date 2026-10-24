import Image from "next/image";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import {
  FaArrowLeft,
  FaArrowUp,
  FaClock,
  FaEnvelope,
  FaLocationDot,
} from "react-icons/fa6";

import { getCategoryPath, mainNavigation, routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { company } from "@/data/company";
import { getRootCategories } from "@/lib/queries/categories";
import { getPrimaryWhatsAppHref } from "@/lib/utils/whatsapp";

const footerNavigation = [
  ...mainNavigation,
  { label: "المفضلة", href: routes.favorites },
].filter(
  (item, index, items) =>
    items.findIndex((candidate) => candidate.href === item.href) === index,
);

const footerLinkClass =
  "inline-flex min-h-10 max-w-full items-center rounded-sm py-1 text-xs leading-6 text-muted transition-colors duration-200 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transition-none";

export async function Footer() {
  const rootCategories = await getRootCategories();

  return (
    <footer className="relative isolate overflow-hidden border-t border-border bg-surface">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-px max-w-2xl bg-gradient-to-r from-transparent via-primary/50 to-transparent"
      />

      <div className="site-container">
        {/* Brand signature */}
        <div className="flex flex-col gap-6 border-b border-border py-9 sm:py-11 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
          <Link
            href={routes.home}
            aria-label={`${company.nameAr} — الرئيسية`}
            className="inline-flex w-fit min-w-0 items-center gap-3 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:gap-4"
          >
            <Image
              src={siteConfig.logo.src}
              alt=""
              width={72}
              height={72}
              className="size-16 shrink-0 rounded-control object-contain sm:size-18"
            />

            <div dir="ltr" className="min-w-0 text-start">
              <span className="block text-base font-medium tracking-[0.2em] text-primary sm:text-xl">
                ELKHOLY
              </span>

              <span className="mt-2 block text-[8px] leading-5 tracking-[0.15em] text-muted sm:text-[10px]">
                LIGHTING SOLUTIONS
              </span>
            </div>
          </Link>

          <p className="max-w-md text-sm leading-8 text-muted lg:text-end">
            {company.tagline}
          </p>
        </div>

        {/* Navigation and contact */}
        <div
          className={`grid gap-x-8 gap-y-9 py-10 sm:grid-cols-2 sm:py-12 ${
            rootCategories.length > 0
              ? "lg:grid-cols-[0.85fr_1fr_1.2fr]"
              : "lg:grid-cols-[1fr_1.2fr]"
          } lg:gap-x-16 xl:gap-x-24`}
        >
          {/* Website navigation */}
          <nav aria-label="روابط تذييل الموقع" className="min-w-0">
            <h2 className="mb-4 flex items-center gap-3 text-sm font-medium text-foreground">
              <span
                aria-hidden="true"
                className="h-px w-5 shrink-0 bg-primary/60"
              />
              اكتشف الخولي
            </h2>

            <ul className="space-y-0.5">
              {footerNavigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={footerLinkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Categories from the catalog */}
          {rootCategories.length > 0 && (
            <nav aria-label="فئات المنتجات في تذييل الموقع" className="min-w-0">
              <h2 className="mb-4 flex items-center gap-3 text-sm font-medium text-foreground">
                <span
                  aria-hidden="true"
                  className="h-px w-5 shrink-0 bg-primary/60"
                />
                عالم من الاختيارات
              </h2>

              <ul className="space-y-0.5">
                {rootCategories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={getCategoryPath(category.slug)}
                      className={footerLinkClass}
                    >
                      {category.name_ar}
                    </Link>
                  </li>
                ))}
              </ul>

              <Link
                href={routes.products}
                className="group mt-3 inline-flex min-h-10 items-center gap-3 rounded-sm text-xs font-medium text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                جميع المنتجات
                <FaArrowLeft
                  aria-hidden="true"
                  className="size-3 transition-transform duration-200 motion-safe:group-hover:-translate-x-1 motion-reduce:transition-none"
                />
              </Link>
            </nav>
          )}

          {/* Contact */}
          <div className="min-w-0 border-t border-border pt-7 sm:col-span-2 lg:col-span-1 lg:border-s lg:border-t-0 lg:ps-8 lg:pt-0">
            <h2 className="text-sm font-medium text-foreground">
              قريبين منك، ومن اختياراتك.
            </h2>

            <p className="mt-2 text-xs leading-7 text-muted">
              لسؤال عن منتج أو مساعدة في الاختيار، يسعدنا تواصلك.
            </p>

            <a
              href={getPrimaryWhatsAppHref()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="تحدث مع فريق الخولي عبر واتساب — يفتح في تبويب جديد"
              className="mt-4 inline-flex min-h-11 items-center gap-2.5 rounded-full border border-primary/25 bg-primary/5 px-4 text-xs font-medium text-primary transition-colors duration-300 hover:border-primary hover:bg-primary hover:text-on-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transition-none"
            >
              <FaWhatsapp aria-hidden="true" className="size-4 shrink-0" />
              تحدث مع فريق الخولي
            </a>

            <div className="mt-6 space-y-4">
              <a
                href={`mailto:${company.email}`}
                className="flex min-h-10 w-fit max-w-full items-center gap-3 rounded-sm text-xs leading-6 text-muted transition-colors duration-200 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transition-none"
              >
                <FaEnvelope
                  aria-hidden="true"
                  className="size-3.5 shrink-0 text-primary"
                />

                <span dir="ltr" className="min-w-0 break-all">
                  {company.email}
                </span>
              </a>

              <div className="flex items-start gap-3">
                <FaClock
                  aria-hidden="true"
                  className="mt-1 size-3.5 shrink-0 text-primary"
                />

                <div className="min-w-0">
                  <h3 className="text-xs font-medium leading-6 text-foreground">
                    مواعيد العمل
                  </h3>

                  <p className="mt-1 text-xs leading-7 text-muted">
                    {company.workingHours.days}
                    <br />
                    {company.workingHours.hours}
                  </p>
                </div>
              </div>

              <Link
                href={routes.branches}
                className="group inline-flex min-h-10 items-center gap-3 rounded-sm text-xs font-medium text-muted transition-colors duration-200 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transition-none"
              >
                <FaLocationDot
                  aria-hidden="true"
                  className="size-3.5 shrink-0 text-primary"
                />
                عناوين معارضنا بدمنهور
                <FaArrowLeft
                  aria-hidden="true"
                  className="size-3 shrink-0 transition-transform duration-200 motion-safe:group-hover:-translate-x-1 motion-reduce:transition-none"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-border py-5 sm:flex-row sm:gap-6">
          <p className="text-center text-[10px] leading-6 text-muted sm:text-start sm:text-[11px]">
            © {new Date().getFullYear()} {company.nameAr}. جميع الحقوق محفوظة.
          </p>

          <a
            href="#top"
            className="group inline-flex min-h-11 shrink-0 items-center gap-3 rounded-full text-[11px] text-muted transition-colors duration-200 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transition-none"
          >
            العودة للأعلى
            <span className="flex size-9 items-center justify-center rounded-full border border-border transition-colors duration-200 group-hover:border-primary/50 group-hover:bg-primary/5 motion-reduce:transition-none">
              <FaArrowUp
                aria-hidden="true"
                className="size-3 transition-transform duration-200 motion-safe:group-hover:-translate-y-0.5 motion-reduce:transition-none"
              />
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
