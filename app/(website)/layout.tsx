import type { ReactNode } from "react";

import { Footer } from "@/components/layout/footer";
import { FloatingWhatsApp } from "@/components/layout/floating-whatsapp";
import { Navbar } from "@/components/layout/navbar";
import { InstallPrompt } from "@/components/pwa/install-prompt";

type WebsiteLayoutProps = {
  children: ReactNode;
};

export default function WebsiteLayout({ children }: WebsiteLayoutProps) {
  return (
    <>
      <div id="top" aria-hidden="true" />

      <a
        href="#main-content"
        className="sr-only fixed start-4 top-4 z-50 rounded-control bg-primary px-5 py-3 font-semibold text-on-primary focus:not-sr-only"
      >
        انتقل إلى المحتوى
      </a>

      <Navbar />

      <main id="main-content" tabIndex={-1}>
        {children}
      </main>

      <Footer />
      <FloatingWhatsApp />
      <InstallPrompt />
    </>
  );
}
