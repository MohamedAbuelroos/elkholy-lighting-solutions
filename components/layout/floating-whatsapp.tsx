import { FaWhatsapp } from "react-icons/fa";

import { getPrimaryWhatsAppHref } from "@/lib/utils/whatsapp";

export function FloatingWhatsApp() {
  return (
    <a
      href={getPrimaryWhatsAppHref()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="تواصل مع الخولي عبر واتساب — يفتح في تبويب جديد"
      title="تواصل معنا عبر واتساب"
      className="fixed left-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-30 flex size-12 items-center justify-center rounded-full border border-white/20 bg-[#128C4A] text-white shadow-[0_6px_24px_rgba(0,0,0,0.25)] transition-colors duration-200 hover:bg-[#107C41] sm:left-6 sm:bottom-[calc(1.5rem+env(safe-area-inset-bottom))] sm:size-14"
    >
      <FaWhatsapp aria-hidden="true" className="size-7 sm:size-8" />
    </a>
  );
}
