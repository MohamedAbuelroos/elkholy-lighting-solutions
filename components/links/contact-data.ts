import type { IconType } from "react-icons";
import {
  FaWhatsapp,
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";
import { FaGlobe, FaPhone, FaEnvelope } from "react-icons/fa6";

import { company } from "@/data/company";
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp";

export type ContactEntry = {
  name: string;
  label: string;
  href: string;
  number?: string;
};

export type ContactGroup = {
  id: string;
  title: string;
  icon: IconType;
  external: boolean;
  entries: ContactEntry[];
};

export type ContactCardData = {
  id: string;
  title: string;
  subtitle: string;
  icon: IconType;
  featured?: boolean;
} & ({ group: ContactGroup; href?: never } | { href: string; group?: never });

export function isWebUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

const groups: ContactGroup[] = [
  {
    id: "whatsapp",
    title: "تواصل معنا عبر واتساب",
    icon: FaWhatsapp,
    external: true,
    entries: company.whatsapp.map((contact) => ({
      name: contact.name,
      label: contact.label,
      number: contact.number,
      href: buildWhatsAppUrl(contact.number),
    })),
  },
  {
    id: "phone",
    title: "اتصل بنا",
    icon: FaPhone,
    external: false,
    entries: company.phones.map((contact) => ({
      name: contact.name,
      label: contact.label,
      number: contact.number,
      href: `tel:${contact.number.replace(/\s/g, "")}`,
    })),
  },
  {
    id: "facebook",
    title: "صفحات Facebook",
    icon: FaFacebookF,
    external: true,
    entries: company.social.facebook
      .filter((account) => isWebUrl(account.url))
      .map((account) => ({
        name: account.name,
        label: account.label,
        href: account.url,
      })),
  },
  {
    id: "instagram",
    title: "حسابات Instagram",
    icon: FaInstagram,
    external: true,
    entries: company.social.instagram
      .filter((account) => isWebUrl(account.url))
      .map((account) => ({
        name: account.name,
        label: account.label,
        href: account.url,
      })),
  },
];

export const contactCards: ContactCardData[] = [];

for (const group of groups) {
  if (group.entries.length === 0) continue;

  contactCards.push({
    id: group.id,
    title:
      group.id === "whatsapp"
        ? "WhatsApp"
        : group.id === "phone"
          ? "اتصل بنا"
          : group.id === "facebook"
            ? "Facebook"
            : "Instagram",
    subtitle:
      group.id === "whatsapp" || group.id === "phone"
        ? `${group.entries.length} أرقام للتواصل`
        : `${group.entries.length} حسابات متاحة`,
    icon: group.icon,
    featured: group.id === "whatsapp",
    group,
  });
}

// Keep the official website immediately after WhatsApp.
contactCards.splice(contactCards[0]?.id === "whatsapp" ? 1 : 0, 0, {
  id: "website",
  title: "الموقع الرسمي",
  subtitle: "اكتشف المنتجات وحلول الخولي",
  icon: FaGlobe,
  featured: true,
  href: "/",
});

if (isWebUrl(company.social.tiktok)) {
  contactCards.push({
    id: "tiktok",
    title: "TikTok",
    subtitle: "تابع أحدث أعمالنا",
    icon: FaTiktok,
    href: company.social.tiktok,
  });
}

if (isWebUrl(company.social.youtube)) {
  contactCards.push({
    id: "youtube",
    title: "YouTube",
    subtitle: "شاهد أحدث الفيديوهات",
    icon: FaYoutube,
    href: company.social.youtube,
  });
}

if (company.email.trim()) {
  contactCards.push({
    id: "email",
    title: "البريد الإلكتروني",
    subtitle: company.email,
    icon: FaEnvelope,
    href: `mailto:${company.email}`,
  });
}
