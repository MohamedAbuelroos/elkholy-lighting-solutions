import Image from "next/image";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { FaArrowUp, FaEnvelope } from "react-icons/fa6";

import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { company } from "@/data/company";
import { getPrimaryWhatsAppHref } from "@/lib/utils/whatsapp";

const navigation = [
  { label: "الرئيسية", href: routes.home },
  { label: "أقسام المنتجات", href: "/#categories" },
  { label: "منتجات مختارة", href: "/#featured-products" },
  { label: "حلول الخولي", href: "/#solutions" },
  { label: "وسائل التواصل والفروع", href: routes.links },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="site-container">
        <div className="grid gap-10 py-12 sm:py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-16">
          {/* Brand */}
          <div className="max-w-sm">
            <Link
              href={routes.home}
              aria-label={`${company.nameAr} — الرئيسية`}
              className="inline-flex items-center gap-3"
            >
              <Image
                src={siteConfig.logo.src}
                alt=""
                width={56}
                height={56}
                className="size-14 rounded-control object-contain"
              />

              <div dir="ltr" className="text-start">
                <span className="block text-lg font-semibold tracking-[0.18em] text-primary">
                  ELKHOLY
                </span>

                <span className="mt-1 block text-[9px] tracking-[0.14em] text-muted">
                  LIGHTING SOLUTIONS
                </span>
              </div>
            </Link>

            <p className="mt-5 text-sm leading-8 text-muted">
              {company.tagline}
            </p>

            <a
              href={getPrimaryWhatsAppHref()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="تواصل مع الخولي عبر واتساب — يفتح في تبويب جديد"
              className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-hover"
            >
              <FaWhatsapp aria-hidden="true" className="size-5" />
              تحدث مع فريق الخولي
            </a>
          </div>

          {/* Navigation */}
          <nav aria-label="روابط تذييل الموقع">
            <h2 className="mb-4 text-sm font-semibold text-foreground">
              اكتشف الخولي
            </h2>

            <ul className="space-y-1">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-10 items-center text-sm text-muted transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Business information */}
          <div>
            <h2 className="mb-4 text-sm font-semibold text-foreground">
              سعداء بتواصلكم
            </h2>

            <a
              href={`mailto:${company.email}`}
              className="inline-flex min-h-10 max-w-full items-center gap-3 text-sm text-muted transition-colors hover:text-primary"
            >
              <FaEnvelope
                aria-hidden="true"
                className="size-4 shrink-0 text-primary"
              />

              <span dir="ltr" className="break-all">
                {company.email}
              </span>
            </a>

            <div className="mt-5 border-t border-border pt-5">
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
              href={routes.links}
              className="mt-4 inline-flex min-h-10 items-center text-sm font-medium text-primary transition-colors hover:text-primary-hover"
            >
              عناوين الفروع ووسائل التواصل
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-border py-5 sm:flex-row">
          <p className="text-center text-xs leading-6 text-muted sm:text-start">
            © {new Date().getFullYear()} {company.nameAr}. جميع الحقوق محفوظة.
          </p>

          <a
            href="#top"
            className="inline-flex min-h-10 items-center gap-2 text-xs text-muted transition-colors hover:text-primary"
          >
            العودة للأعلى
            <FaArrowUp aria-hidden="true" className="size-3" />
          </a>
        </div>
      </div>
    </footer>
  );
}
