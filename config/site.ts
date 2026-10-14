import { company } from "@/data/company";

export const siteConfig = {
  name: company.name,
  nameAr: company.nameAr,
  url: "https://elkholylightingsolutions.com",
  description: company.tagline,
  locale: "ar",
  currency: "EGP",
  logo: {
    src: "/logo/logo-elkholy.jpg",
    alt: company.nameAr,
  },
  hero: {
    src: "/images/hero - Copy.jpg",
    alt: "صورة توضيحية لمعرض الخولي للإضاءة والأنظمة الذكية",
  },
  defaultWhatsAppMessage:
    "مرحبًا، أتواصل معكم من خلال موقع الخولي للاستفسار عن حلول الإضاءة والأنظمة الذكية.",
} as const;
