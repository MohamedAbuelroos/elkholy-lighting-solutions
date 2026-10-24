"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import {
  FaArrowLeft,
  FaArrowRight,
  FaImage,
  FaImages,
  FaXmark,
} from "react-icons/fa6";

import { company } from "@/data/company";
import { buildWhatsAppUrl, getPrimaryWhatsAppHref } from "@/lib/utils/whatsapp";
import type { Project } from "@/types/project";

import styles from "./project-dialog.module.css";

type ProjectDialogProps = {
  project: Project;
  onClose: () => void;
};

const countFormatter = new Intl.NumberFormat("ar-EG");

const imageArrowClassName =
  "absolute top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/55 text-white transition-colors duration-200 hover:border-[#E2B858]/60 hover:bg-black/75 hover:text-[#E2B858] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2B858] disabled:cursor-default disabled:opacity-25 motion-reduce:transition-none sm:size-11";

export function ProjectDialog({ project, onClose }: ProjectDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  const titleId = useId();
  const descriptionId = useId();

  const [selection, setSelection] = useState({
    projectId: project.id,
    index: 0,
  });

  if (selection.projectId !== project.id) {
    setSelection({
      projectId: project.id,
      index: 0,
    });
  }

  const imageCount = project.images.length;

  const activeIndex = Math.min(selection.index, Math.max(0, imageCount - 1));

  const current = project.images[activeIndex];

  const officialContact = company.whatsapp.find(
    (contact) => contact.name === company.name,
  );

  const inquiryHref = officialContact
    ? buildWhatsAppUrl(
        officialContact.number,
        `مرحبًا، شاهدت مشروع «${project.title_ar}» على موقع الخولي، وأود الاستفسار عن اختيارات مناسبة لمساحتي.`,
      )
    : getPrimaryWhatsAppHref();

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

  useEffect(() => {
    const track = thumbnailsRef.current;

    const thumbnail = track?.querySelector<HTMLButtonElement>(
      '[aria-pressed="true"]',
    );

    if (!track || !thumbnail) return;

    const viewport = track.getBoundingClientRect();
    const item = thumbnail.getBoundingClientRect();

    if (item.right > viewport.right) {
      track.scrollBy({
        left: item.right - viewport.right,
        behavior: "instant",
      });
    } else if (item.left < viewport.left) {
      track.scrollBy({
        left: item.left - viewport.left,
        behavior: "instant",
      });
    }
  }, [activeIndex, project.id]);

  function selectImage(index: number) {
    setSelection({
      projectId: project.id,
      index: Math.max(0, Math.min(imageCount - 1, index)),
    });
  }

  function closeDialog() {
    dialogRef.current?.close();
  }

  return (
    <dialog
      ref={dialogRef}
      dir="rtl"
      aria-labelledby={titleId}
      aria-describedby={project.description_ar ? descriptionId : undefined}
      onClose={(event) => {
        const dialog = event.currentTarget;

        if (!dialog.open && dialog.isConnected) {
          onClose();
        }
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;

        const bounds = event.currentTarget.getBoundingClientRect();

        const outside =
          event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom;

        if (outside) closeDialog();
      }}
      onKeyDown={(event) => {
        if (event.altKey || event.ctrlKey || event.metaKey) return;

        if (event.key === "ArrowRight" && imageCount > 1) {
          event.preventDefault();
          selectImage(activeIndex - 1);
        }

        if (event.key === "ArrowLeft" && imageCount > 1) {
          event.preventDefault();
          selectImage(activeIndex + 1);
        }
      }}
      className="fixed inset-0 m-auto max-h-[92dvh] w-[calc(100%_-_1rem)] max-w-6xl overflow-y-auto overscroll-contain rounded-3xl border border-border bg-background p-0 text-foreground shadow-2xl backdrop:bg-black/80 backdrop:backdrop-blur-sm lg:overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-4 border-b border-border bg-surface px-4 py-3 sm:px-6">
        <p
          dir="ltr"
          className="text-[9px] font-medium tracking-[0.2em] text-primary"
        >
          ELKHOLY · PROJECT GALLERY
        </p>

        <button
          type="button"
          autoFocus
          onClick={closeDialog}
          aria-label="إغلاق المشروع"
          className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-background text-muted transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <FaXmark aria-hidden="true" className="size-4" />
        </button>
      </div>

      <div className="grid lg:h-[min(76dvh,760px)] lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Gallery */}
        <div className="flex min-h-0 min-w-0 flex-col bg-surface">
          <div className="relative isolate aspect-[4/3] min-w-0 overflow-hidden bg-[#08090C] lg:aspect-auto lg:min-h-0 lg:flex-1">
            {current ? (
              <Image
                key={current.id}
                src={current.src}
                alt={current.alt || project.title_ar}
                fill
                loading="eager"
                sizes="(min-width: 1200px) 820px, (min-width: 1024px) 65vw, 100vw"
                className={`object-contain p-2 sm:p-4 ${styles.image}`}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/50">
                <FaImage aria-hidden="true" className="size-8" />
                <p className="text-xs">لا توجد صور لهذا المشروع.</p>
              </div>
            )}

            {imageCount > 1 && (
              <>
                <button
                  type="button"
                  aria-label="الصورة السابقة"
                  disabled={activeIndex === 0}
                  onClick={() => selectImage(activeIndex - 1)}
                  className={`${imageArrowClassName} start-3 sm:start-4`}
                >
                  <FaArrowRight aria-hidden="true" className="size-3.5" />
                </button>

                <button
                  type="button"
                  aria-label="الصورة التالية"
                  disabled={activeIndex === imageCount - 1}
                  onClick={() => selectImage(activeIndex + 1)}
                  className={`${imageArrowClassName} end-3 sm:end-4`}
                >
                  <FaArrowLeft aria-hidden="true" className="size-3.5" />
                </button>
              </>
            )}

            {imageCount > 0 && (
              <p
                role="status"
                aria-atomic="true"
                className="absolute bottom-3 start-1/2 -translate-x-1/2 rounded-full border border-white/15 bg-black/65 px-3 py-1 text-[10px] leading-5 tabular-nums text-white"
              >
                <span className="sr-only">الصورة </span>
                {countFormatter.format(activeIndex + 1)}
                <span aria-hidden="true"> / </span>
                <span className="sr-only"> من </span>
                {countFormatter.format(imageCount)}
              </p>
            )}
          </div>

          {/* Centered thumbnails with horizontal overflow */}
          {imageCount > 1 && (
            <div className="shrink-0 border-t border-border p-3 sm:p-4">
              <div
                ref={thumbnailsRef}
                role="group"
                aria-label="اختيار صورة المشروع"
                className="overflow-x-auto overscroll-x-contain p-1 [scrollbar-width:thin]"
              >
                <div className="mx-auto flex w-max gap-2">
                  {project.images.map((image, index) => {
                    const selected = activeIndex === index;

                    return (
                      <button
                        key={image.id}
                        type="button"
                        aria-label={`عرض الصورة ${index + 1}`}
                        aria-pressed={selected}
                        onClick={() => selectImage(index)}
                        className={`relative h-14 w-[76px] shrink-0 overflow-hidden rounded-xl border-2 bg-surface-elevated transition-[border-color,opacity] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none sm:h-16 sm:w-[88px] ${
                          selected
                            ? "border-primary opacity-100"
                            : "border-transparent opacity-50 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={image.src}
                          alt=""
                          fill
                          sizes="88px"
                          className="object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Project details */}
        <div className="flex min-h-0 min-w-0 flex-col border-t border-border p-5 sm:p-7 lg:overflow-y-auto lg:border-s lg:border-t-0">
          {project.category_ar && (
            <p className="text-[11px] font-medium leading-6 text-primary">
              {project.category_ar}
            </p>
          )}

          <h2
            id={titleId}
            className="mt-3 break-words text-2xl font-medium leading-[1.7] text-foreground"
          >
            {project.title_ar}
          </h2>

          <p className="mt-4 flex items-center gap-2 text-[11px] leading-6 text-muted">
            <FaImages
              aria-hidden="true"
              className="size-3.5 shrink-0 text-primary"
            />
            {countFormatter.format(imageCount)} صور للمشروع
          </p>

          {project.description_ar && (
            <div className="mt-6 border-t border-border pt-5">
              <h3 className="text-xs font-medium text-foreground">
                عن المكان والتفاصيل
              </h3>

              <p
                id={descriptionId}
                className="mt-3 whitespace-pre-line break-words text-sm leading-8 text-muted"
              >
                {project.description_ar}
              </p>
            </div>
          )}

          <div className="mt-auto pt-8">
            <div className="border-t border-border pt-5">
              <p className="text-xs leading-7 text-muted">
                بتفكّر في اختيارات مشابهة لمساحتك؟
              </p>

              <a
                href={inquiryHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex min-h-12 items-center justify-center gap-3 rounded-full bg-primary px-4 text-xs font-medium text-on-primary transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                <FaWhatsapp aria-hidden="true" className="size-4 shrink-0" />
                تحدث معنا عن مشروعك
                <span className="sr-only">يفتح في تبويب جديد</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
}
