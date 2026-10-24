const steps = [
  {
    number: "01",
    title: "نسمع احتياجك",
    description:
      "احكِ لنا عن مساحتك، وطبيعة استخدامها، والشكل الذي تتخيّله لها.",
  },
  {
    number: "02",
    title: "نوضّح الاختيارات",
    description:
      "تعرّف على المنتجات والمواصفات والفروق بين الخيارات المناسبة لك.",
  },
  {
    number: "03",
    title: "تختار على بيّنة",
    description:
      "وازن بين التصميم والاستخدام والميزانية، واسأل عن كل تفصيلة تهمك.",
  },
] as const;

export function AboutExperience() {
  return (
    <section
      aria-labelledby="about-experience-title"
      className="section-space border-t border-border bg-background"
    >
      <div className="site-container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-4 text-xs font-medium text-primary">
            تجربة الاختيار
          </p>

          <h2
            id="about-experience-title"
            className="text-[clamp(1.75rem,3vw,2.5rem)] font-medium leading-[1.65] text-foreground"
          >
            من أول سؤال،
            <span className="text-primary"> لقرار أوضح.</span>
          </h2>
        </div>

        <ol className="mt-9 grid gap-7 md:grid-cols-3 md:gap-8">
          {steps.map((step) => (
            <li key={step.number} className="border-t border-border pt-5">
              <span
                aria-hidden="true"
                className="text-xs tabular-nums text-primary"
              >
                {step.number}
              </span>

              <h3 className="mt-4 text-base font-medium leading-7 text-foreground">
                {step.title}
              </h3>

              <p className="mt-3 max-w-sm text-sm leading-8 text-muted">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
