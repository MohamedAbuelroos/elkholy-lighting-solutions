"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaExpand,
  FaImage,
  FaXmark,
} from "react-icons/fa6";

import type { ProductImage } from "@/types/product";

import styles from "./product-gallery.module.css";

type ProductGalleryProps = {
  images: ProductImage[];
  productName: string;
};

const arrowClassName =
  "flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-foreground transition-colors hover:border-primary/60 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-25 sm:size-11";

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const current = images[activeIndex];

  function previousImage() {
    setActiveIndex((index) => Math.max(0, index - 1));
  }

  function nextImage() {
    setActiveIndex((index) => Math.min(images.length - 1, index + 1));
  }

  if (!current) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-card border border-border bg-surface">
        <div className="text-center text-muted">
          <FaImage aria-hidden="true" className="mx-auto size-9 opacity-40" />

          <p className="mt-4 text-sm">صورة المنتج غير متاحة حاليًا</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-0">
      <div className="relative isolate overflow-hidden rounded-card border border-border bg-surface">
        <button
          type="button"
          onClick={() => dialogRef.current?.showModal()}
          aria-label={`تكبير صورة ${productName}`}
          className="group relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-primary"
        >
          <Image
            key={`${activeIndex}:${current.src}`}
            src={current.src}
            alt={current.alt || productName}
            fill
            preload={activeIndex === 0}
            sizes="(min-width: 1280px) 650px, (min-width: 1024px) 55vw, 100vw"
            className={`object-cover ${styles.image}`}
          />

          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/35 to-transparent"
          />

          <span className="absolute bottom-4 start-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/30 px-3.5 py-2 text-[11px] text-white backdrop-blur-md sm:bottom-5 sm:start-5">
            <FaExpand aria-hidden="true" className="size-3" />
            تكبير الصورة
          </span>

          <span
            aria-hidden="true"
            className="absolute end-4 top-4 rounded-full border border-white/25 bg-black/30 px-3 py-1.5 text-[11px] tabular-nums text-white backdrop-blur-md"
          >
            {activeIndex + 1} / {images.length}
          </span>
        </button>
      </div>

      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 sm:mt-5 sm:gap-4">
          <button
            type="button"
            aria-label="الصورة السابقة"
            disabled={activeIndex === 0}
            onClick={previousImage}
            className={arrowClassName}
          >
            <FaArrowRight aria-hidden="true" className="size-3.5" />
          </button>

          <div
            aria-label="اختيار صورة المنتج"
            className="flex min-w-0 justify-center gap-1.5 sm:gap-2"
          >
            {images.map((image, index) => (
              <button
                key={`${image.src}:${index}`}
                type="button"
                aria-label={`عرض الصورة ${index + 1} من ${images.length}`}
                aria-pressed={activeIndex === index}
                onClick={() => setActiveIndex(index)}
                className={`relative aspect-[4/3] min-w-0 max-w-24 flex-1 overflow-hidden rounded-lg border-2 transition-[border-color,opacity] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:rounded-xl ${
                  activeIndex === index
                    ? "border-primary opacity-100"
                    : "border-transparent opacity-55 hover:opacity-100"
                }`}
              >
                <Image
                  src={image.src}
                  alt=""
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            aria-label="الصورة التالية"
            disabled={activeIndex === images.length - 1}
            onClick={nextImage}
            className={arrowClassName}
          >
            <FaArrowLeft aria-hidden="true" className="size-3.5" />
          </button>
        </div>
      )}

      <p role="status" className="sr-only">
        الصورة {activeIndex + 1} من {images.length}
      </p>

      <dialog
        ref={dialogRef}
        aria-label={`صور ${productName}`}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            dialogRef.current?.close();
          }
        }}
        className="fixed inset-0 m-auto h-[90dvh] max-h-none w-[calc(100%-1rem)] max-w-6xl overflow-hidden rounded-2xl border border-border bg-background p-0 text-foreground backdrop:bg-black/85 backdrop:backdrop-blur-sm"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3">
            <p className="min-w-0 truncate text-sm">{productName}</p>

            <button
              type="button"
              autoFocus
              onClick={() => dialogRef.current?.close()}
              aria-label="إغلاق عرض الصورة"
              className={arrowClassName}
            >
              <FaXmark aria-hidden="true" className="size-4" />
            </button>
          </div>

          <div className="relative min-h-0 flex-1">
            <Image
              key={`expanded:${current.src}`}
              src={current.src}
              alt={current.alt || productName}
              fill
              sizes="(min-width: 1280px) 1152px, 100vw"
              className="object-contain p-3 sm:p-6"
            />
          </div>

          {images.length > 1 && (
            <div className="flex items-center justify-center gap-5 border-t border-border px-4 py-3">
              <button
                type="button"
                aria-label="الصورة السابقة"
                disabled={activeIndex === 0}
                onClick={previousImage}
                className={arrowClassName}
              >
                <FaArrowRight aria-hidden="true" className="size-4" />
              </button>

              <span className="text-xs tabular-nums text-muted">
                {activeIndex + 1} / {images.length}
              </span>

              <button
                type="button"
                aria-label="الصورة التالية"
                disabled={activeIndex === images.length - 1}
                onClick={nextImage}
                className={arrowClassName}
              >
                <FaArrowLeft aria-hidden="true" className="size-4" />
              </button>
            </div>
          )}
        </div>
      </dialog>
    </div>
  );
}
