import { LightTrails } from "@/components/ui/light-trails";
import { company } from "@/data/company";

export function AboutStory() {
  return (
    <section
      aria-labelledby="about-story-title"
      className="section-space relative isolate overflow-hidden border-y border-border bg-surface"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-30"
      >
        <LightTrails variant="arc" />
      </div>

      <div className="site-container">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="mb-4 flex items-center gap-3 text-xs font-medium text-primary">
              <span aria-hidden="true" className="h-px w-8 bg-primary/70" />
              حكايتنا
            </p>

            <h2
              id="about-story-title"
              className="text-[clamp(1.75rem,3vw,2.5rem)] font-medium leading-[1.65] text-foreground"
            >
              تتغيّر المساحات،
              <span className="block text-primary">
                ويظل الاهتمام بالتفاصيل.
              </span>
            </h2>
          </div>

          <div className="max-w-2xl">
            <p className="text-sm leading-9 text-foreground sm:text-base sm:leading-9">
              {company.nameAr} في دمنهور، تجمع تحت سقف واحد منتجات الإضاءة
              والتشطيبات الكهربائية والأنظمة الذكية والصوتية، لتسهّل عليك اكتشاف
              الخيارات التي تكمل منزلك أو مشروعك.
            </p>

            <p className="mt-4 text-sm leading-8 text-muted">
              نؤمن أن اختيار القطعة المناسبة يبدأ بفهم المكان: كيف يُستخدم، وما
              الطابع الذي تريد أن تمنحه له، والتفاصيل التي تهمك في كل يوم.
            </p>

            <p className="mt-4 text-sm leading-8 text-muted">
              لذلك نساعدك تتعرّف على المنتجات، وتقارن بين المواصفات، وتختار ما
              يتناسب مع احتياجاتك؛ من قطعة إضاءة واحدة إلى تفاصيل مساحتك
              بالكامل.
            </p>

            <p className="mt-7 border-s border-primary/40 ps-4 text-sm font-medium leading-8 text-primary">
              نختار التفاصيل معك، لتختار مساحتك بثقة.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
