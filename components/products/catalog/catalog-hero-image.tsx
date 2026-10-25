"use client";

import Image from "next/image";
import { useState } from "react";

type CatalogHeroImageProps = {
  src: string;
};

type ImageState = {
  src: string;
  previousSrc: string | null;
  loaded: boolean;
  failed: boolean;
};

export function CatalogHeroImage({ src }: CatalogHeroImageProps) {
  const [image, setImage] = useState<ImageState>({
    src,
    previousSrc: null,
    loaded: false,
    failed: false,
  });

  if (image.src !== src) {
    setImage({
      src,
      previousSrc: image.loaded ? image.src : image.previousSrc,
      loaded: false,
      failed: false,
    });
  }

  const imageClassName = "object-cover object-[35%_center] lg:object-center";

  const showImage = !image.failed && (!image.previousSrc || image.loaded);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-20"
    >
      {image.previousSrc && (
        <Image
          key={`previous-${image.previousSrc}`}
          src={image.previousSrc}
          alt=""
          fill
          sizes="100vw"
          className={imageClassName}
        />
      )}

      <Image
        key={image.src}
        src={image.src}
        alt=""
        fill
        loading="eager"
        sizes="100vw"
        onLoad={() => {
          setImage((current) =>
            current.src === src
              ? { ...current, loaded: true, failed: false }
              : current,
          );
        }}
        onError={() => {
          setImage((current) =>
            current.src === src
              ? { ...current, loaded: false, failed: true }
              : current,
          );
        }}
        className={`${imageClassName} transition-opacity duration-700 ease-out motion-reduce:transition-none ${
          showImage ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
