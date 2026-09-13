"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import type { IconType } from "react-icons";

import {
  FaWhatsapp,
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";

import {
  FaGlobe,
  FaPhone,
  FaLocationDot,
  FaEnvelope,
  FaClock,
  FaChevronLeft,
  FaXmark,
} from "react-icons/fa6";

import { company } from "@/data/company";

type SheetType = "whatsapp" | "phone" | "facebook" | "instagram" | null;

type LinkCard = {
  title: string;
  subtitle: string;
  icon: IconType;
  href?: string;
  sheet?: Exclude<SheetType, null>;
  featured?: boolean;
};

const cards: LinkCard[] = [
  {
    title: "WhatsApp",
    subtitle: `${company.whatsapp.length} أرقام للتواصل`,
    icon: FaWhatsapp,
    sheet: "whatsapp",
    featured: true,
  },
  {
    title: "الموقع الرسمي",
    subtitle: company.name,
    icon: FaGlobe,
    href: company.website,
    featured: true,
  },
  {
    title: "اتصل بنا",
    subtitle: `${company.phones.length} أرقام للتواصل`,
    icon: FaPhone,
    sheet: "phone",
  },
  {
    title: "Facebook",
    subtitle: `${company.social.facebook.length} صفحات`,
    icon: FaFacebookF,
    sheet: "facebook",
  },
  {
    title: "Instagram",
    subtitle: `${company.social.instagram.length} حسابات`,
    icon: FaInstagram,
    sheet: "instagram",
  },
  {
    title: "TikTok",
    subtitle: "تابع أحدث أعمالنا",
    icon: FaTiktok,
    href: company.social.tiktok,
  },
  {
    title: "YouTube",
    subtitle: "شاهد أحدث الفيديوهات",
    icon: FaYoutube,
    href: company.social.youtube,
  },

  // {
  //   title: "الفروع",
  //   subtitle: "اعرف موقعنا على الخريطة",
  //   icon: FaLocationDot,
  //   href: company.social.maps,
  // },
  {
    title: "البريد الإلكتروني",
    subtitle: company.email,
    icon: FaEnvelope,
    href: `mailto:${company.email}`,
  },
];

export default function LinksPage() {
  const [activeSheet, setActiveSheet] = useState<SheetType>(null);

  useEffect(() => {
    document.body.style.overflow = activeSheet ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [activeSheet]);

  const closeSheet = () => {
    setActiveSheet(null);
  };

  const getWhatsAppUrl = (number: string) => {
    const cleanNumber = number.replace(/\D/g, "");

    const message = encodeURIComponent(
      "مرحبًا، أتواصل معكم من خلال موقع Elkholy Lighting Solutions.",
    );

    return `https://wa.me/${cleanNumber}?text=${message}`;
  };

  const getSheetTitle = () => {
    if (activeSheet === "whatsapp") return "تواصل معنا عبر واتساب";
    if (activeSheet === "phone") return "اتصل بنا";
    if (activeSheet === "facebook") return "صفحات Facebook";
    if (activeSheet === "instagram") return "حسابات Instagram";

    return "";
  };

  return (
    <>
      <main className="relative min-h-screen overflow-hidden bg-[#05070b] px-4 py-8 text-white sm:px-6 sm:py-10">
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute right-[-140px] top-[-120px] h-[380px] w-[380px] rounded-full bg-[#D6A744]/10 blur-[130px]" />

          <div className="absolute bottom-[-140px] left-[-120px] h-[340px] w-[340px] rounded-full bg-[#D6A744]/5 blur-[130px]" />

          <div className="absolute left-[-25%] top-[32%] h-[220px] w-[150%] rotate-[-6deg] rounded-[50%] border-t border-[#D6A744]/10" />

          <div className="absolute right-[-25%] bottom-[15%] h-[220px] w-[150%] rotate-[6deg] rounded-[50%] border-t border-[#D6A744]/10" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(214,167,68,0.04),transparent_40%)]" />
        </div>

        <div className="relative z-10 mx-auto max-w-xl">
          {/* Back */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-white/40 transition-colors duration-300 hover:text-[#D6A744]"
            >
              <FaChevronLeft className="text-[10px]" />

              <span>العودة للموقع</span>
            </Link>
          </div>

          {/* Profile */}
          <section className="text-center">
            <div className="relative mx-auto mb-6 h-32 w-32 sm:h-36 sm:w-36">
              <div className="absolute inset-2 rounded-[32px] bg-[#D6A744]/20 blur-3xl" />

              <div className="relative h-full w-full overflow-hidden rounded-[30px] border border-[#D6A744]/25 bg-black shadow-[0_25px_90px_rgba(0,0,0,0.55)]">
                <Image
                  src="/logo/elkholy-logo.jpeg"
                  alt={company.name}
                  fill
                  priority
                  sizes="144px"
                  className="object-cover"
                />
              </div>
            </div>

            <p className="text-[11px] tracking-[0.42em] text-[#D6A744]">
              ELKHOLY
            </p>

            <h1 className="mt-3 text-2xl font-bold sm:text-3xl">
              {company.nameAr}
            </h1>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-white/50 sm:text-base">
              {company.tagline}
            </p>

            <div className="mx-auto mt-6 h-px w-16 bg-gradient-to-r from-transparent via-[#D6A744] to-transparent" />
          </section>

          {/* Links */}
          <section className="mt-10 space-y-3">
            {cards.map((item) => {
              const Icon = item.icon;
              const hasSheet = Boolean(item.sheet);

              const commonClassName = `
                group
                relative
                flex
                min-h-[110px]
                w-full
                items-center
                justify-between
                overflow-hidden
                rounded-[24px]
                border
                px-5
                py-5
                text-right
                backdrop-blur-sm
                transition-all
                duration-300
                hover:-translate-y-0.5
                sm:px-6
              `;

              const normalClassName = `
                border-white/[0.08]
                bg-gradient-to-l
                from-white/[0.045]
                to-white/[0.018]
                hover:border-[#D6A744]/30
                hover:bg-[#D6A744]/[0.035]
              `;

              const featuredClassName = `
                border-[#D6A744]/20
                bg-gradient-to-l
                from-[#D6A744]/[0.07]
                via-white/[0.035]
                to-white/[0.018]
                shadow-[0_15px_60px_rgba(0,0,0,0.15)]
                hover:border-[#D6A744]/40
                hover:shadow-[0_18px_70px_rgba(214,167,68,0.06)]
              `;

              const content = (
                <>
                  <div className="relative z-10 flex min-w-0 items-center gap-4">
                    {/* Icon */}
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] border border-[#D6A744]/20 bg-[#D6A744]/[0.07] text-2xl text-[#D6A744] transition-all duration-300 group-hover:border-[#D6A744]/35 group-hover:bg-[#D6A744]/10">
                      <Icon />
                    </div>

                    {/* Text */}
                    <div className="min-w-0">
                      <h2 className="text-lg font-bold text-white sm:text-xl">
                        {item.title}
                      </h2>

                      <p className="mt-1 truncate text-sm text-white/40">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="relative z-10 mr-4 flex shrink-0 items-center gap-3">
                    {hasSheet && (
                      <span className="hidden rounded-full border border-[#D6A744]/15 bg-[#D6A744]/[0.05] px-3 py-1.5 text-xs text-[#D6A744]/80 sm:inline-flex">
                        عرض الكل
                      </span>
                    )}

                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.07] bg-white/[0.025] text-white/25 transition-all duration-300 group-hover:border-[#D6A744]/20 group-hover:bg-[#D6A744]/[0.05] group-hover:text-[#D6A744]">
                      <FaChevronLeft className="text-xs transition-transform duration-300 group-hover:-translate-x-0.5" />
                    </div>
                  </div>

                  {/* Hover glow */}
                  <div className="pointer-events-none absolute -left-20 top-1/2 h-36 w-36 -translate-y-1/2 rounded-full bg-[#D6A744]/0 blur-3xl transition-all duration-500 group-hover:bg-[#D6A744]/10" />
                </>
              );

              if (hasSheet) {
                return (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => setActiveSheet(item.sheet!)}
                    className={`${commonClassName} ${
                      item.featured ? featuredClassName : normalClassName
                    }`}
                  >
                    {content}
                  </button>
                );
              }

              return (
                <a
                  key={item.title}
                  href={item.href}
                  target={item.href?.startsWith("http") ? "_blank" : undefined}
                  rel={
                    item.href?.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className={`${commonClassName} ${
                    item.featured ? featuredClassName : normalClassName
                  }`}
                >
                  {content}
                </a>
              );
            })}
          </section>

          {/* Business Information */}
          <section className="mt-6 space-y-3">
            {/* Working Hours */}
            <div className="rounded-[24px] border border-white/[0.07] bg-white/[0.025] p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] border border-[#D6A744]/10 bg-[#D6A744]/[0.07] text-lg text-[#D6A744]">
                  <FaClock />
                </div>

                <div>
                  <p className="font-semibold text-white">مواعيد العمل</p>

                  <p className="mt-2 text-sm leading-7 text-white/45">
                    {company.workingHours.days}
                    <br />
                    {company.workingHours.hours}
                  </p>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="rounded-[24px] border border-white/[0.07] bg-white/[0.025] p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] border border-[#D6A744]/10 bg-[#D6A744]/[0.07] text-lg text-[#D6A744]">
                  <FaLocationDot />
                </div>

                <div className="min-w-0">
                  <p className="font-semibold text-white">فروعنا</p>

                  <div className="mt-3 space-y-3">
                    {company.branches.map((branch, index) => (
                      <div key={branch.name}>
                        <p className="text-sm font-medium text-white/70">
                          {branch.name}
                        </p>

                        <p className="mt-1 text-sm leading-6 text-white/40">
                          {branch.address}
                        </p>

                        {index < company.branches.length - 1 && (
                          <div className="mt-3 h-px bg-white/[0.06]" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Message */}
          <section className="mx-auto mt-9 max-w-lg text-center">
            <p className="text-xs leading-6 text-white/30 sm:text-sm">
              سعداء بتواصلكم معنا لمساعدتكم في اختيار أفضل حلول الإضاءة والأنظمة
              الذكية لمنازلكم ومشروعاتكم.
            </p>
          </section>

          {/* Footer */}
          <footer className="mt-10 border-t border-white/[0.07] pt-7 text-center">
            <p className="text-[10px] tracking-[0.3em] text-[#D6A744]/70 sm:text-xs">
              ELKHOLY LIGHTING SOLUTIONS
            </p>

            <p className="mt-3 text-xs text-white/25">
              © 2026 جميع الحقوق محفوظة
            </p>
          </footer>
        </div>
      </main>

      {/* Overlay */}
      <div
        onClick={closeSheet}
        className={`fixed inset-0 z-40 bg-black/75 backdrop-blur-sm transition-all duration-300 ${
          activeSheet
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      {/* Bottom Sheet */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-hidden={!activeSheet}
        className={`fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[85vh] max-w-xl transform overflow-hidden rounded-t-[32px] border-x border-t border-white/[0.08] bg-[#0A0C10] shadow-[0_-30px_100px_rgba(0,0,0,0.65)] transition-transform duration-500 ease-out ${
          activeSheet ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Sheet handle */}
        <div className="flex justify-center pt-3">
          <span className="h-1 w-12 rounded-full bg-white/15" />
        </div>

        {/* Sheet header */}
        <div className="flex items-start justify-between border-b border-white/[0.07] px-5 pb-5 pt-4 sm:px-6">
          <div>
            <p className="text-[10px] tracking-[0.32em] text-[#D6A744]">
              ELKHOLY
            </p>

            <h2 className="mt-2 text-xl font-bold text-white">
              {getSheetTitle()}
            </h2>

            <p className="mt-1 text-xs text-white/40">
              اختر الحساب أو جهة التواصل المناسبة
            </p>
          </div>

          <button
            type="button"
            onClick={closeSheet}
            aria-label="إغلاق"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] text-white/60 transition-all duration-300 hover:border-[#D6A744]/30 hover:bg-[#D6A744]/[0.05] hover:text-[#D6A744]"
          >
            <FaXmark />
          </button>
        </div>

        {/* Sheet content */}
        <div className="max-h-[65vh] overflow-y-auto px-4 pb-7 pt-4 sm:px-6">
          {/* WhatsApp */}
          {activeSheet === "whatsapp" && (
            <div className="space-y-3">
              {company.whatsapp.map((contact, index) => (
                <a
                  key={`${contact.name}-${index}`}
                  href={getWhatsAppUrl(contact.number)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between rounded-[22px] border border-white/[0.07] bg-white/[0.035] p-4 transition-all duration-300 hover:border-[#D6A744]/25 hover:bg-[#D6A744]/[0.04]"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#D6A744]/10 text-xl text-[#D6A744]">
                      <FaWhatsapp />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-white">
                        {contact.name}
                      </h3>

                      <p className="mt-1 text-xs text-white/35">
                        {contact.label}
                      </p>

                      <p
                        dir="ltr"
                        className="mt-1 text-right text-xs text-white/30"
                      >
                        +{contact.number.replace(/\D/g, "")}
                      </p>
                    </div>
                  </div>

                  <FaChevronLeft className="shrink-0 text-xs text-white/20 transition-all duration-300 group-hover:-translate-x-1 group-hover:text-[#D6A744]" />
                </a>
              ))}
            </div>
          )}

          {/* Phone */}
          {activeSheet === "phone" && (
            <div className="space-y-3">
              {company.phones.map((contact, index) => (
                <a
                  key={`${contact.name}-${index}`}
                  href={`tel:${contact.number.replace(/\s/g, "")}`}
                  className="group flex items-center justify-between rounded-[22px] border border-white/[0.07] bg-white/[0.035] p-4 transition-all duration-300 hover:border-[#D6A744]/25 hover:bg-[#D6A744]/[0.04]"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#D6A744]/10 text-lg text-[#D6A744]">
                      <FaPhone />
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-semibold text-white">
                        {contact.name}
                      </h3>

                      <p className="mt-1 text-xs text-white/35">
                        {contact.label}
                      </p>

                      <p
                        dir="ltr"
                        className="mt-1 text-right text-xs text-white/30"
                      >
                        {contact.number}
                      </p>
                    </div>
                  </div>

                  <FaChevronLeft className="shrink-0 text-xs text-white/20 transition-all duration-300 group-hover:-translate-x-1 group-hover:text-[#D6A744]" />
                </a>
              ))}
            </div>
          )}
          {/* Facebook */}
          {activeSheet === "facebook" && (
            <div className="space-y-3">
              {company.social.facebook.map((account, index) => (
                <a
                  key={`${account.name}-${index}`}
                  href={account.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between rounded-[22px] border border-white/[0.07] bg-white/[0.035] p-4 transition-all duration-300 hover:border-[#D6A744]/25 hover:bg-[#D6A744]/[0.04]"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#D6A744]/10 text-xl text-[#D6A744]">
                      <FaFacebookF />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-white">
                        {account.name}
                      </h3>

                      <p className="mt-1 text-xs text-white/35">
                        {account.label}
                      </p>
                    </div>
                  </div>

                  <FaChevronLeft className="shrink-0 text-xs text-white/20 transition-all duration-300 group-hover:-translate-x-1 group-hover:text-[#D6A744]" />
                </a>
              ))}
            </div>
          )}

          {/* Instagram */}
          {activeSheet === "instagram" && (
            <div className="space-y-3">
              {company.social.instagram.map((account, index) => (
                <a
                  key={`${account.name}-${index}`}
                  href={account.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between rounded-[22px] border border-white/[0.07] bg-white/[0.035] p-4 transition-all duration-300 hover:border-[#D6A744]/25 hover:bg-[#D6A744]/[0.04]"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#D6A744]/10 text-xl text-[#D6A744]">
                      <FaInstagram />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-white">
                        {account.name}
                      </h3>

                      <p className="mt-1 text-xs text-white/35">
                        {account.label}
                      </p>
                    </div>
                  </div>

                  <FaChevronLeft className="shrink-0 text-xs text-white/20 transition-all duration-300 group-hover:-translate-x-1 group-hover:text-[#D6A744]" />
                </a>
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
