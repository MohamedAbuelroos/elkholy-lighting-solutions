import Image from "next/image";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import {
  FaArrowLeft,
  FaArrowUp,
  FaEnvelope,
  FaLocationDot,
} from "react-icons/fa6";

import { getCategoryPath, mainNavigation, routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { getRootCategories } from "@/lib/queries/categories";
import { company } from "@/data/company";
import { getPrimaryWhatsAppHref } from "@/lib/utils/whatsapp";

const footerNavigation = [
  ...mainNavigation,
  { label: "المفضلة", href: routes.favorites },
];

const footerLinkClass =
  "inline-flex min-h-10 items-center text-sm leading-6 text-muted transition-colors hover:text-primary";

export async function Footer() {
  const rootCategories = await getRootCategories();
  return (
    <footer className="relative border-t border-border bg-surface">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 mx-auto h-px max-w-lg bg-gradient-to-r from-transparent via-primary/40 to-transparent"
      />

      <div className="site-container">
        <div className="grid gap-9 py-12 sm:grid-cols-2 sm:py-14 lg:grid-cols-[1.2fr_0.8fr_1fr_1.1fr] lg:gap-8">
          {/* Brand */}
          <div>
            <Link
              href={routes.home}
              aria-label={`${company.nameAr} — الرئيسية`}
              className="inline-flex items-center gap-3"
            >
              <Image
                src={siteConfig.logo.src}
                alt=""
                width={64}
                height={64}
                className="size-16 shrink-0 rounded-control object-contain"
              />

              <div dir="ltr" className="text-start">
                <span className="block text-base font-semibold tracking-[0.18em] text-primary">
                  ELKHOLY
                </span>

                <span className="mt-1 block text-[9px] tracking-[0.12em] text-muted">
                  LIGHTING SOLUTIONS
                </span>
              </div>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-8 text-muted">
              {company.tagline}
            </p>

            <a
              href={getPrimaryWhatsAppHref()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="تحدث مع فريق الخولي عبر واتساب — يفتح في تبويب جديد"
              className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-control border border-primary/25 bg-primary/5 px-4 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-on-primary"
            >
              <FaWhatsapp aria-hidden="true" className="size-4" />
              تحدث مع فريق الخولي
            </a>
          </div>

          {/* Website navigation */}
          <nav aria-label="روابط تذييل الموقع">
            <h2 className="mb-4 text-sm font-semibold text-foreground">
              اكتشف الخولي
            </h2>

            <ul className="space-y-1">
              {footerNavigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={footerLinkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Product categories */}
          <nav aria-label="فئات المنتجات في تذييل الموقع">
            <h2 className="mb-4 text-sm font-semibold text-foreground">
              فئات المنتجات
            </h2>

            <ul className="space-y-1">
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
          </nav>

          {/* Contact information */}
          <div className="min-w-0">
            <h2 className="mb-4 text-sm font-semibold text-foreground">
              سعداء بتواصلكم
            </h2>

            <a
              href={`mailto:${company.email}`}
              className="inline-flex min-h-10 max-w-full items-center gap-2 text-xs text-muted transition-colors hover:text-primary"
            >
              <FaEnvelope
                aria-hidden="true"
                className="size-3.5 shrink-0 text-primary"
              />

              <span dir="ltr" className="break-all">
                {company.email}
              </span>
            </a>

            <div className="mt-4 border-t border-border pt-4">
              <h3 className="text-xs font-medium text-foreground">
                مواعيد العمل
              </h3>

              <p className="mt-2 text-sm leading-7 text-muted">
                {company.workingHours.days}
                <br />
                {company.workingHours.hours}
              </p>
            </div>

            <Link
              href={routes.branches}
              className="group mt-4 inline-flex min-h-11 items-center gap-2 text-xs font-semibold text-primary transition-colors hover:text-primary-hover"
            >
              <FaLocationDot aria-hidden="true" className="size-3.5 shrink-0" />
              عناوين معارضنا
              <FaArrowLeft aria-hidden="true" className="size-3 shrink-0" />
            </Link>
          </div>
        </div>

        {/* Copyright and back to top */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-border py-5 sm:flex-row">
          <p className="text-center text-[11px] leading-6 text-muted sm:text-start">
            © {new Date().getFullYear()} {company.nameAr}. جميع الحقوق محفوظة.
          </p>

          <a
            href="#top"
            className="inline-flex min-h-10 items-center gap-2 text-xs text-muted transition-colors hover:text-primary"
          >
            العودة للأعلى
            <span className="flex size-8 items-center justify-center rounded-full border border-border">
              <FaArrowUp aria-hidden="true" className="size-3" />
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
