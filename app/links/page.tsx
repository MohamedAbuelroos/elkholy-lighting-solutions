import Image from "next/image";
import Link from "next/link";
import { company } from "@/data/company";

const links = [
  {
    title: "الموقع الرسمي",
    subtitle: company.name,
    href: company.website,
    icon: "🌐",
  },
  {
    title: "اتصل بنا",
    subtitle: company.phone,
    href: `tel:${company.phone}`,
    icon: "📞",
  },
  {
    title: "الفروع",
    subtitle: "اعرف موقعنا على الخريطة",
    href: company.social.maps,
    icon: "📍",
  },
  {
    title: "Instagram",
    subtitle: "تابع أحدث المنتجات والمشروعات",
    href: company.social.instagram,
    icon: "📸",
  },
  {
    title: "Facebook",
    subtitle: "تابعنا على فيسبوك",
    href: company.social.facebook,
    icon: "f",
  },
  {
    title: "TikTok",
    subtitle: "شاهد أحدث أعمالنا",
    href: company.social.tiktok,
    icon: "♪",
  },
  {
    title: "YouTube",
    subtitle: "شاهد أحدث الفيديوهات",
    href: company.social.youtube,
    icon: "▶",
  },
  {
    title: "البريد الإلكتروني",
    subtitle: company.email,
    href: `mailto:${company.email}`,
    icon: "✉",
  },
];

export default function LinksPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] px-5 py-10 text-white">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-[-120px] top-[-100px] h-[350px] w-[350px] rounded-full bg-[#D6A744]/10 blur-[120px]" />

        <div className="absolute bottom-[-120px] left-[-100px] h-[320px] w-[320px] rounded-full bg-[#D6A744]/5 blur-[120px]" />

        <div className="absolute left-[-20%] top-[33%] h-[220px] w-[140%] rotate-[-7deg] rounded-[50%] border-t border-[#D6A744]/15" />

        <div className="absolute right-[-20%] bottom-[15%] h-[200px] w-[140%] rotate-[7deg] rounded-[50%] border-t border-[#D6A744]/10" />
      </div>

      <div className="relative z-10 mx-auto max-w-xl">
        {/* Back */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-white/45 transition hover:text-[#D6A744]"
          >
            <span>←</span>
            العودة للموقع
          </Link>
        </div>

        {/* Profile */}
        <section className="text-center">
          <div className="relative mx-auto mb-6 h-32 w-32">
            <div className="absolute inset-2 rounded-full bg-[#D6A744]/20 blur-2xl" />

            <div className="relative h-full w-full overflow-hidden rounded-[28px] border border-[#D6A744]/20 bg-black shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
              <Image
                src="/logo/elkholy-logo.jpeg"
                alt={company.name}
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>

          <p className="text-[11px] tracking-[0.38em] text-[#D6A744]">
            ELKHOLY
          </p>

          <h1 className="mt-3 text-2xl font-bold sm:text-3xl">
            {company.nameAr}
          </h1>

          <p className="mt-3 text-sm leading-7 text-white/50">
            {company.tagline}
          </p>

          <div className="mx-auto mt-6 h-px w-16 bg-[#D6A744]/50" />
        </section>

        {/* WhatsApp CTA */}
        <section className="mt-9">
          <a
            href={`https://wa.me/${company.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center justify-between rounded-[26px] border border-[#D6A744]/30 bg-gradient-to-l from-[#D6A744] to-[#C89938] px-5 py-5 text-[#080a0d] shadow-[0_20px_60px_rgba(214,167,68,0.12)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_70px_rgba(214,167,68,0.2)]"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black/10 text-xl">
                💬
              </div>

              <div>
                <p className="font-bold">تواصل معنا عبر واتساب</p>
                <p className="mt-1 text-xs text-black/55">
                  أسرع طريقة للتواصل معنا
                </p>
              </div>
            </div>

            <span className="text-xl transition group-hover:-translate-x-1">
              ←
            </span>
          </a>
        </section>

        {/* Social & Contact Links */}
        <section className="mt-4 space-y-3">
          {links.map((item) => (
            <a
              key={item.title}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={item.href.startsWith("http") ? "noreferrer" : undefined}
              className="group flex items-center justify-between rounded-[22px] border border-white/[0.08] bg-white/[0.035] px-5 py-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#D6A744]/35 hover:bg-[#D6A744]/[0.05]"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.04] text-lg text-[#D6A744] transition group-hover:border-[#D6A744]/20 group-hover:bg-[#D6A744]/10">
                  {item.icon}
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-white">
                    {item.title}
                  </h2>

                  <p className="mt-1 text-xs text-white/40">{item.subtitle}</p>
                </div>
              </div>

              <span className="text-lg text-white/25 transition group-hover:-translate-x-1 group-hover:text-[#D6A744]">
                ←
              </span>
            </a>
          ))}
        </section>

        {/* Working Hours */}
        <section className="mt-6 rounded-[24px] border border-white/[0.07] bg-white/[0.025] p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#D6A744]/10 text-[#D6A744]">
              ◷
            </div>

            <div>
              <p className="text-sm font-semibold">مواعيد العمل</p>

              <p className="mt-2 text-sm leading-7 text-white/45">
                {company.workingHours.days}
                <br />
                {company.workingHours.hours}
              </p>
            </div>
          </div>
        </section>

        {/* Address */}
        <section className="mt-3 rounded-[24px] border border-white/[0.07] bg-white/[0.025] p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#D6A744]/10 text-[#D6A744]">
              📍
            </div>

            <div>
              <p className="text-sm font-semibold">عنوان المعرض</p>

              <p className="mt-2 text-sm leading-7 text-white/45">
                {company.address}
              </p>
            </div>
          </div>
        </section>

        {/* Message */}
        <section className="mt-8 text-center">
          <p className="text-xs leading-6 text-white/30">
            سعداء بتواصلكم معنا لمساعدتكم في اختيار أفضل حلول الإضاءة والأنظمة
            الذكية لمنازلكم ومشروعاتكم.
          </p>
        </section>

        {/* Footer */}
        <footer className="mt-10 border-t border-white/[0.07] pt-7 text-center">
          <p className="text-[10px] tracking-[0.3em] text-[#D6A744]/70">
            ELKHOLY LIGHTING SOLUTIONS
          </p>

          <p className="mt-3 text-xs text-white/25">
            © 2026 جميع الحقوق محفوظة
          </p>
        </footer>
      </div>
    </main>
  );
}
