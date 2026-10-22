"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { FaArrowLeft, FaArrowRight, FaXmark } from "react-icons/fa6";

import type { Project } from "@/types/project";

import styles from "./project-dialog.module.css";

type ProjectDialogProps = {
  project: Project;
  onClose: () => void;
};

const arrowClassName =
  "flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-foreground transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-25";

export function ProjectDialog({ project, onClose }: ProjectDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  const [activeIndex, setActiveIndex] = useState(0);
  const current = project.images[activeIndex];

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    const previousOverflow = document.body.style.overflow;

    if (!dialog.open) {
      dialog.showModal();
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;

      if (dialog.open) {
        dialog.close();
      }
    };
  }, []);

  function previousImage() {
    setActiveIndex((index) => Math.max(0, index - 1));
  }

  function nextImage() {
    setActiveIndex((index) => Math.min(project.images.length - 1, index + 1));
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={(event) => {
        const dialog = event.currentTarget;
        if (dialog.open || !dialog.isConnected) return;
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          dialogRef.current?.close();
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          previousImage();
        }

        if (event.key === "ArrowLeft") {
          event.preventDefault();
          nextImage();
        }
      }}
      className="fixed inset-0 m-auto max-h-[92dvh] w-[calc(100%-1rem)] max-w-6xl overflow-y-auto rounded-2xl border border-border bg-background p-0 text-foreground shadow-2xl backdrop:bg-black/80 backdrop:backdrop-blur-sm lg:overflow-hidden"
    >
      <div className="flex items-center justify-between gap-4 border-b border-border bg-surface px-4 py-3 sm:px-6">
        <p className="text-[10px] font-medium tracking-[0.18em] text-primary">
          ELKHOLY PROJECTS
        </p>

        <button
          type="button"
          autoFocus
          onClick={() => dialogRef.current?.close()}
          aria-label="إغلاق المشروع"
          className={arrowClassName}
        >
          <FaXmark aria-hidden="true" className="size-4" />
        </button>
      </div>

      <div className="grid lg:h-[76dvh] lg:max-h-[760px] lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex min-h-0 min-w-0 flex-col bg-surface">
          <div className="relative aspect-[4/3] overflow-hidden lg:aspect-auto lg:min-h-0 lg:flex-1">
            {current ? (
              <Image
                key={current.id}
                src={current.src}
                alt={current.alt || project.title_ar}
                fill
                sizes="(min-width: 1024px) 820px, 100vw"
                className={`object-contain p-2 sm:p-4 ${styles.image}`}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted">
                لا توجد صور لهذا المشروع.
              </div>
            )}
          </div>

          {project.images.length > 1 && (
            <div className="border-t border-border p-3 sm:p-4">
              <div className="mb-3 flex items-center justify-between gap-4">
                <button
                  type="button"
                  aria-label="الصورة السابقة"
                  disabled={activeIndex === 0}
                  onClick={previousImage}
                  className={arrowClassName}
                >
                  <FaArrowRight aria-hidden="true" className="size-3.5" />
                </button>

                <p role="status" className="text-xs tabular-nums text-muted">
                  {activeIndex + 1} / {project.images.length}
                </p>

                <button
                  type="button"
                  aria-label="الصورة التالية"
                  disabled={activeIndex === project.images.length - 1}
                  onClick={nextImage}
                  className={arrowClassName}
                >
                  <FaArrowLeft aria-hidden="true" className="size-3.5" />
                </button>
              </div>

              <div
                aria-label="صور المشروع"
                className="flex gap-2 overflow-x-auto pb-1"
              >
                {project.images.map((image, index) => (
                  <button
                    key={image.id}
                    type="button"
                    aria-label={`عرض الصورة ${index + 1}`}
                    aria-pressed={activeIndex === index}
                    onClick={() => setActiveIndex(index)}
                    className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-[border-color,opacity] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:h-16 sm:w-24 ${
                      activeIndex === index
                        ? "border-primary opacity-100"
                        : "border-transparent opacity-50 hover:opacity-100"
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
            </div>
          )}
        </div>

        <div className="border-t border-border p-5 sm:p-6 lg:overflow-y-auto lg:border-s lg:border-t-0">
          <p className="text-xs font-medium text-primary">
            {project.category_ar}
          </p>

          <h2
            id={titleId}
            className="mt-3 break-words text-2xl font-semibold leading-relaxed"
          >
            {project.title_ar}
          </h2>

          {project.description_ar && (
            <div className="mt-6 border-t border-border pt-5">
              <h3 className="text-xs font-semibold">عن المشروع</h3>

              <p className="mt-3 whitespace-pre-line break-words text-sm leading-8 text-muted">
                {project.description_ar}
              </p>
            </div>
          )}

          <p className="mt-6 text-[11px] leading-6 text-muted">
            {project.images.length} صور للمشروع
          </p>
        </div>
      </div>
    </dialog>
  );
}
