import type { Metadata } from "next";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { BusinessInfo } from "@/components/links/business-info";
import { ContactLinks } from "@/components/links/contact-links";
import { LinksProfile } from "@/components/links/links-profile";
import { LightTrails } from "@/components/ui/light-trails";
import { routes } from "@/config/routes";

export const metadata: Metadata = {
  title: "روابط الخولي | التواصل والمعارض",
  description:
    "تواصل مع الخولي، وتابع حساباتنا، وتعرّف على عناوين المعارض ومواعيد العمل.",
};

export default function LinksPage() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-background px-4 text-foreground sm:px-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[620px] overflow-hidden opacity-30"
      >
        <LightTrails variant="arc" />
      </div>

      <div className="mx-auto max-w-lg pb-5 pt-5 sm:pt-7">
        <div className="mb-7 flex items-center justify-between gap-4">
          <Link
            href={routes.home}
            className="group inline-flex min-h-11 items-center gap-2 rounded-full px-2 text-xs text-muted transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <FaArrowRight
              aria-hidden="true"
              className="size-3 transition-transform duration-200 motion-safe:group-hover:translate-x-0.5 motion-reduce:transition-none"
            />
            اكتشف الموقع
          </Link>

          <div className="links-theme-toggle">
            <ThemeToggle />
          </div>
        </div>

        <LinksProfile />
        <ContactLinks />
        <BusinessInfo />

        <footer className="mt-8 border-t border-border pb-3 pt-6 text-center">
          <p
            dir="ltr"
            className="text-[9px] font-medium leading-6 tracking-[0.2em] text-primary"
          >
            ELKHOLY LIGHTING SOLUTIONS
          </p>

          <p className="mt-2 text-[10px] leading-6 text-muted">
            © {new Date().getFullYear()} جميع الحقوق محفوظة
          </p>
        </footer>
      </div>
    </main>
  );
}
