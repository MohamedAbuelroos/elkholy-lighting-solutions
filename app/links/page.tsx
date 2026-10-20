import type { Metadata } from "next";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { LinksProfile } from "@/components/links/links-profile";
import { ContactLinks } from "@/components/links/contact-links";
import { BusinessInfo } from "@/components/links/business-info";
import { LightTrails } from "@/components/ui/light-trails";

export const metadata: Metadata = {
  title: "التواصل والفروع | الخولي",
  description: "أرقام التواصل وحسابات الخولي وعناوين المعارض ومواعيد العمل.",
};

export default function LinksPage() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-background px-4 py-6 text-foreground sm:px-6 sm:py-9">
      <LightTrails variant="arc" />

      <div className="relative z-10 mx-auto max-w-xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-2 text-xs text-muted transition-colors hover:text-primary"
          >
            <FaArrowRight aria-hidden="true" className="size-3" />
            العودة للموقع
          </Link>

          <div className="links-theme-toggle">
            <ThemeToggle />
          </div>
        </div>

        <LinksProfile />
        <ContactLinks />
        <BusinessInfo />

        <p className="mx-auto mt-8 max-w-md text-center text-xs leading-7 text-muted">
          سعداء بتواصلكم لمساعدتكم في اختيار حلول الإضاءة والأنظمة الذكية
          المناسبة لمنازلكم ومشروعاتكم.
        </p>

        <footer className="mt-8 border-t border-border py-6 text-center">
          <p dir="ltr" className="text-[9px] tracking-[0.2em] text-primary">
            ELKHOLY LIGHTING SOLUTIONS
          </p>

          <p className="mt-3 text-xs text-muted">
            © {new Date().getFullYear()} جميع الحقوق محفوظة
          </p>
        </footer>
      </div>
    </main>
  );
}
