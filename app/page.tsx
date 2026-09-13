import Link from "next/link";

const features = [
  {
    title: "أحدث حلول الإضاءة",
    description: "حلول متكاملة تناسب مختلف الاحتياجات والمساحات",
  },
  {
    title: "خبرة كبيرة",
    description: "في مجال الإضاءة والتشطيبات الكهربائية",
  },
  {
    title: "أنظمة المنازل الذكية",
    description: "حلول ذكية لحياة أكثر راحة وأمانًا",
  },
  {
    title: "منتجات عالية الجودة",
    description: "من أفضل العلامات التجارية العالمية",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#05070b] text-white">
      {/* Navbar */}
      <header className="absolute inset-x-0 top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
          <Link
            href="/links"
            className="rounded-full border border-white/20 px-5 py-2.5 text-sm transition-all duration-300 hover:border-[#D6A744] hover:text-[#D6A744]"
          >
            تواصل معنا
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-white/70 md:flex">
            <a
              href="#"
              className="relative text-[#D6A744] after:absolute after:-bottom-2 after:right-0 after:h-px after:w-full after:bg-[#D6A744]"
            >
              الرئيسية
            </a>

            <a href="#coming-soon" className="transition hover:text-white">
              من نحن
            </a>

            <a href="#services" className="transition hover:text-white">
              منتجاتنا
            </a>

            <a href="#coming-soon" className="transition hover:text-white">
              مشاريعنا
            </a>
          </nav>

          <span className="text-sm text-white/70">AR</span>
        </div>
      </header>

      {/* Hero */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(270deg, rgba(5,7,11,0.98) 0%, rgba(5,7,11,0.82) 42%, rgba(5,7,11,0.15) 75%), url('/images/hero-lighting.jpg')",
          }}
        />

        {/* Dark overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(214,167,68,0.15),transparent_38%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-[#05070b]/85" />

        {/* Gold curve */}
        <div className="pointer-events-none absolute -bottom-28 left-[-10%] h-[260px] w-[120%] rotate-[-3deg] rounded-[50%] border-t border-[#D6A744]/40" />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6 pt-28 lg:px-10">
          <div className="max-w-2xl">
            {/* Logo */}
            <div className="mb-8 flex items-center gap-5">
              <div className="relative">
                <div className="absolute inset-0 rounded-3xl bg-[#D6A744]/10 blur-2xl" />

                {/* <Image
                  src="/logo/elkholy-logo.jpeg"
                  alt="Elkholy Lighting Solutions"
                  width={150}
                  height={150}
                  priority
                  className="relative rounded-3xl object-cover shadow-[0_0_45px_rgba(214,167,68,0.18)]"
                /> */}
              </div>

              <div>
                <p className="text-xs tracking-[0.38em] text-[#D6A744]">
                  ELKHOLY
                </p>

                <p className="mt-2 text-xs tracking-[0.28em] text-white/45">
                  LIGHTING SOLUTIONS
                </p>
              </div>
            </div>

            {/* Small label */}
            <p className="mb-5 text-sm tracking-[0.28em] text-white/45">
              الخولى لحلول الإضاءة
            </p>

            {/* Title */}
            <h1 className="text-4xl font-bold leading-[1.35] sm:text-5xl lg:text-6xl">
              حلول <span className="text-[#D6A744]">الإضاءة</span> الذكية
              <br />
              والتشطيبات الكهربائية الحديثة
            </h1>

            {/* Description */}
            <p className="mt-7 max-w-xl text-base leading-8 text-white/60 sm:text-lg">
              نعمل حاليًا على إطلاق موقعنا الجديد لنقدم لكم تجربة رقمية متكاملة
              لاكتشاف أحدث حلول الإضاءة والأنظمة الذكية والتشطيبات الكهربائية
              للمنازل والمشروعات التجارية.
            </p>

            {/* Buttons */}
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/links"
                className="rounded-full bg-[#D6A744] px-7 py-3.5 font-semibold text-[#090b0f] shadow-[0_10px_30px_rgba(214,167,68,0.15)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#e2b756]"
              >
                تواصل معنا الآن
              </Link>

              <a
                href="#services"
                className="rounded-full border border-white/20 px-7 py-3.5 font-medium text-white transition-all duration-300 hover:-translate-y-1 hover:border-white/40 hover:bg-white/5"
              >
                اكتشف المزيد
              </a>
            </div>
          </div>
        </div>

        {/* Vertical text */}
        <div className="absolute left-6 top-1/2 hidden -translate-y-1/2 rotate-[-90deg] text-[10px] tracking-[0.45em] text-white/25 xl:block">
          PREMIUM LIGHTING — A BRIGHTER TOMORROW
        </div>
      </section>

      {/* Features */}
      <section
        id="services"
        className="relative border-y border-white/10 bg-[#070b11] py-16"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(214,167,68,0.04),transparent_55%)]" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-6 sm:grid-cols-2 lg:grid-cols-4 lg:px-10">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative px-5 text-center"
            >
              {index !== features.length - 1 && (
                <span className="absolute left-0 top-1/2 hidden h-20 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-[#D6A744]/25 to-transparent lg:block" />
              )}

              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#D6A744]/30 bg-[#D6A744]/5 text-lg font-semibold text-[#D6A744] transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[#D6A744]/60 group-hover:bg-[#D6A744]/10">
                0{index + 1}
              </div>

              <h3 className="font-semibold">{feature.title}</h3>

              <p className="mx-auto mt-2 max-w-[220px] text-sm leading-6 text-white/45">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Coming Soon */}
      <section
        id="coming-soon"
        className="relative min-h-[620px] overflow-hidden px-6 py-28 text-center"
      >
        {/* Background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,167,68,0.08),transparent_42%)]" />

        <div className="absolute -left-[10%] top-[15%] h-[280px] w-[120%] rotate-[-7deg] rounded-[50%] border-t border-[#D6A744]/20" />

        <div className="absolute -right-[10%] bottom-[5%] h-[260px] w-[120%] rotate-[6deg] rounded-[50%] border-t border-[#D6A744]/25" />

        {/* Pendant image */}
        {/* <div className="pointer-events-none absolute -bottom-4 left-0 hidden w-[260px] opacity-90 md:block lg:w-[320px]">
          <Image
            src="/images/pendant-light.png"
            alt="Luxury Pendant Light"
            width={320}
            height={450}
            className="h-auto w-full object-contain drop-shadow-[0_0_35px_rgba(214,167,68,0.22)]"
          />
        </div> */}

        <div className="relative z-10 mx-auto max-w-3xl">
          <div className="mb-7 flex items-center justify-center gap-5">
            <span className="h-px w-20 bg-gradient-to-l from-[#D6A744]/50 to-transparent" />

            <p className="text-xs tracking-[0.5em] text-[#D6A744]">
              COMING SOON
            </p>

            <span className="h-px w-20 bg-gradient-to-r from-[#D6A744]/50 to-transparent" />
          </div>

          <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            الموقع الجديد قيد التطوير
          </h2>

          <p className="mt-5 text-lg text-white/50">
            ترقبوا تجربة رقمية مميزة قريبًا
          </p>

          <Link
            href="/links"
            className="mt-9 inline-flex rounded-full border border-[#D6A744]/50 px-7 py-3 text-[#D6A744] transition-all duration-300 hover:-translate-y-1 hover:bg-[#D6A744] hover:text-black"
          >
            تواصل معنا
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 bg-[#05070b] px-6 py-9">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 text-center text-sm text-white/40 md:flex-row md:text-right">
          <p>© 2026 Elkholy Lighting Solutions. جميع الحقوق محفوظة.</p>

          <div className="text-center">
            <p className="text-xs tracking-[0.3em] text-white/55">
              ELKHOLY LIGHTING SOLUTIONS
            </p>

            <p className="mt-2 text-xs text-white/30">
              جودة الإضاءة... لبيئة أفضل
            </p>
          </div>

          <Link
            href="/links"
            className="rounded-full border border-white/10 px-5 py-2 text-xs text-white/55 transition hover:border-[#D6A744]/50 hover:text-[#D6A744]"
          >
            جميع وسائل التواصل
          </Link>
        </div>
      </footer>
    </main>
  );
}
