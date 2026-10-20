import Image from "next/image";

import { company } from "@/data/company";

export function LinksProfile() {
  return (
    <header className="text-center">
      <div className="relative mx-auto mb-6 size-28 sm:size-32">
        <div
          aria-hidden="true"
          className="absolute inset-3 rounded-full bg-primary/15 blur-2xl"
        />

        <div className="relative h-full overflow-hidden rounded-3xl border border-primary/25 bg-black">
          <Image
            src="/logo/logo-elkholy.jpg"
            alt=""
            fill
            preload
            sizes="128px"
            className="object-cover"
          />
        </div>
      </div>

      <p
        dir="ltr"
        className="text-[10px] font-medium tracking-[0.35em] text-primary"
      >
        ELKHOLY
      </p>

      <h1 className="mt-3 text-2xl font-semibold leading-[1.5] text-foreground sm:text-3xl">
        {company.nameAr}
      </h1>

      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted">
        {company.tagline}
      </p>

      <span
        aria-hidden="true"
        className="mx-auto mt-6 block h-px w-16 bg-gradient-to-r from-transparent via-primary to-transparent"
      />
    </header>
  );
}
