"use client";

import Image from "next/image";
import { useActionState, useId, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaTrashCan } from "react-icons/fa6";

import { manageProjectImage } from "@/app/admin/projects/image-actions";
import { AdminSuccessNotice } from "@/components/admin/admin-success-notice";

import type {
  AdminProjectImage,
  ProjectImageActionState,
} from "@/lib/admin/project-image-types";

type ProjectImagesGalleryProps = {
  projectId: string;
  projectName: string;
  images: AdminProjectImage[];
  pendingCleanupCount: number;
};

const initialState: ProjectImageActionState = {
  error: null,
  successId: null,
  message: null,
  warning: null,
};

const controlClassName =
  "inline-flex min-h-10 items-center justify-center gap-1 rounded-control border border-border px-2 text-[11px] font-medium transition-colors hover:border-primary/50 hover:text-primary disabled:cursor-default disabled:opacity-35";

export function ProjectImagesGallery({
  projectId,
  projectName,
  images,
  pendingCleanupCount,
}: ProjectImagesGalleryProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const dialogTitleId = useId();

  const [selectedImage, setSelectedImage] = useState<AdminProjectImage | null>(
    null,
  );

  const [state, formAction, isPending] = useActionState(
    async (previousState: ProjectImageActionState, formData: FormData) => {
      const result = await manageProjectImage(
        projectId,
        previousState,
        formData,
      );

      if (!result.error) {
        dialogRef.current?.close();
      }

      return result;
    },
    initialState,
  );

  const cleanupWarning =
    state.warning ??
    (pendingCleanupCount > 0
      ? "توجد صور قديمة في انتظار التنظيف من التخزين."
      : null);

  return (
    <div className="mt-6" aria-busy={isPending}>
      {state.successId && state.message && (
        <AdminSuccessNotice key={state.successId} title={state.message} />
      )}

      {state.error && (
        <p
          role="alert"
          className="mb-4 rounded-control border border-red-500/30 bg-red-500/10 p-4 text-sm leading-7"
        >
          {state.error}
        </p>
      )}

      {cleanupWarning && (
        <div className="mb-5 rounded-control border border-primary/30 bg-primary/5 p-4">
          <p role="status" className="text-sm leading-7">
            {cleanupWarning}
          </p>

          <form action={formAction} className="mt-3">
            <button
              type="submit"
              name="operation"
              value="cleanup"
              disabled={isPending}
              className={controlClassName}
            >
              إعادة محاولة التنظيف
            </button>
          </form>
        </div>
      )}

      {images.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-background px-4 py-8 text-center">
          <p className="text-sm text-muted">لم تُضف صورًا لهذا المشروع بعد.</p>
        </div>
      ) : (
        <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((image, index) => (
            <li
              key={image.id}
              className={`overflow-hidden rounded-xl border bg-background ${
                index === 0 ? "border-primary/60" : "border-border"
              }`}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={image.src}
                  alt={image.alt || projectName}
                  fill
                  sizes="(min-width: 1024px) 200px, (min-width: 640px) 30vw, 50vw"
                  className="object-cover"
                />

                {index === 0 && (
                  <span className="absolute start-2 top-2 rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold text-on-primary">
                    الغلاف
                  </span>
                )}
              </div>

              <div className="p-3">
                <p className="mb-3 text-xs text-muted">الصورة {index + 1}</p>

                <form action={formAction}>
                  <input type="hidden" name="image_id" value={image.id} />

                  <fieldset
                    disabled={isPending}
                    className="grid min-w-0 grid-cols-2 gap-2"
                  >
                    <legend className="sr-only">
                      إدارة الصورة {index + 1}
                    </legend>

                    <button
                      type="submit"
                      name="operation"
                      value="earlier"
                      disabled={index === 0}
                      aria-label={`تقديم الصورة ${index + 1}`}
                      className={controlClassName}
                    >
                      <FaChevronRight aria-hidden="true" className="size-2.5" />
                      تقديم
                    </button>

                    <button
                      type="submit"
                      name="operation"
                      value="later"
                      disabled={index === images.length - 1}
                      aria-label={`تأخير الصورة ${index + 1}`}
                      className={controlClassName}
                    >
                      تأخير
                      <FaChevronLeft aria-hidden="true" className="size-2.5" />
                    </button>

                    <button
                      type="submit"
                      name="operation"
                      value="first"
                      disabled={index === 0}
                      className={`${controlClassName} col-span-2`}
                    >
                      {index === 0 ? "الغلاف الحالي" : "تعيين كغلاف"}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedImage(image);
                        dialogRef.current?.showModal();
                      }}
                      aria-label={`حذف الصورة ${index + 1}`}
                      className={`${controlClassName} col-span-2 border-red-500/20 hover:border-red-500/50 hover:bg-red-500/10`}
                    >
                      <FaTrashCan aria-hidden="true" className="size-3" />
                      حذف الصورة
                    </button>
                  </fieldset>
                </form>
              </div>
            </li>
          ))}
        </ol>
      )}

      <p role="status" className="mt-3 min-h-6 text-xs leading-6 text-muted">
        {isPending ? "جارٍ حفظ التغيير..." : ""}
      </p>

      <dialog
        ref={dialogRef}
        aria-labelledby={dialogTitleId}
        onCancel={(event) => {
          if (isPending) event.preventDefault();
        }}
        className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-card border border-border bg-surface p-6 text-foreground shadow-xl backdrop:bg-black/60"
      >
        <h3 id={dialogTitleId} className="text-lg font-semibold">
          حذف صورة المشروع؟
        </h3>

        <p className="mt-3 text-sm leading-7 text-muted">
          لو حذفت الغلاف، الصورة التالية تصبح الغلاف تلقائيًا. حذف الصورة لا
          يمكن التراجع عنه.
        </p>

        {state.error && (
          <p role="alert" className="mt-4 text-sm leading-7">
            {state.error}
          </p>
        )}

        <form action={formAction} className="mt-6 flex gap-3">
          <input
            type="hidden"
            name="image_id"
            value={selectedImage?.id ?? ""}
          />

          <input type="hidden" name="operation" value="delete" />

          <button
            type="button"
            disabled={isPending}
            onClick={() => dialogRef.current?.close()}
            className={`${controlClassName} flex-1`}
          >
            إلغاء
          </button>

          <button
            type="submit"
            disabled={isPending || !selectedImage}
            className="min-h-11 flex-1 rounded-control bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
          >
            {isPending ? "جارٍ الحذف..." : "تأكيد الحذف"}
          </button>
        </form>
      </dialog>
    </div>
  );
}
