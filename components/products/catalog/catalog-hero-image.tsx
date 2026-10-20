"use client";

import Image from "next/image";
import { useState } from "react";

type CatalogHeroImageProps = {
  src: string;
};

export function CatalogHeroImage({ src }: CatalogHeroImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Image
      src={src}
      alt=""
      fill
      loading="eager"
      sizes="100vw"
      onLoad={() => setLoaded(true)}
      className={`-z-20 object-cover object-[35%_center] transition-opacity duration-500 motion-reduce:transition-none lg:object-center ${
        loaded ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}
