import Image from "next/image";

import { siteConfig } from "@/config/site";
import { company } from "@/data/company";

export function LinksProfile() {
  return (
    <header className="text-center">
      <div className="relative mx-auto mb-6 size-24 sm:size-28">
        <span
          aria-hidden="true"
          className="absolute -inset-2 rotate-6 rounded-[2rem] border border-primary/15"
        />

        <div className="relative h-full overflow-hidden rounded-3xl border border-primary/30 bg-surface">
          <Image
            src={siteConfig.logo.src}
            alt=""
            fill
            preload
            sizes="112px"
            className="object-contain"
          />
        </div>
      </div>

      <p
        dir="ltr"
        className="text-[9px] font-medium tracking-[0.3em] text-primary"
      >
        ELKHOLY · SINCE 2005
      </p>

      <h1 className="mx-auto mt-3 max-w-sm text-xl font-medium leading-[1.8] text-foreground sm:text-2xl">
        {company.nameAr}
      </h1>

      <p className="mx-auto mt-3 max-w-sm text-xs leading-7 text-muted">
        تواصل معنا، تابع جديدنا،
        <br />
        أو خطّط لزيارتك لأحد معارضنا.
      </p>

      <div
        aria-hidden="true"
        className="mt-6 flex items-center justify-center gap-3"
      >
        <span className="h-px w-10 bg-border" />
        <span className="size-1 rotate-45 bg-primary/60" />
        <span className="h-px w-10 bg-border" />
      </div>
    </header>
  );
}
