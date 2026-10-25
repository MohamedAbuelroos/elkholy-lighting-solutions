"use client";

import Image from "next/image";
import { useActionState, useId, useRef, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaTrashCan,
  FaXmark,
} from "react-icons/fa6";

import { manageProductImage } from "@/app/admin/products/image-actions";
import { AdminSuccessNotice } from "@/components/admin/admin-success-notice";
import type {
  AdminProductImage,
  ProductImageActionState,
} from "@/lib/admin/product-image-types";

type ProductImagesGalleryProps = {
  productId: string;
  productName: string;
  images: AdminProductImage[];
};

const initialState: ProductImageActionState = {
  error: null,
  successId: null,
  message: null,
  warning: null,
  cleanupSrc: null,
};

const controlClassName =
  "inline-flex min-h-10 items-center justify-center gap-1 rounded-control border border-border px-2 text-[11px] font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary disabled:cursor-default disabled:opacity-35";

export function ProductImagesGallery({
  productId,
  productName,
  images,
}: ProductImagesGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<AdminProductImage | null>(
    null,
  );

  const dialogRef = useRef<HTMLDialogElement>(null);
  const dialogTitleId = useId();
  const dialogDescriptionId = useId();

  async function performAction(
    previousState: ProductImageActionState,
    formData: FormData,
  ) {
    const result = await manageProductImage(productId, previousState, formData);

    if (!result.error) {
      dialogRef.current?.close();
    }

    return result;
  }

  const [state, formAction, isPending] = useActionState(
    performAction,
    initialState,
  );

  function openDeleteDialog(image: AdminProductImage) {
    setSelectedImage(image);
    dialogRef.current?.showModal();
  }

  function closeDeleteDialog() {
    if (!isPending) {
      dialogRef.current?.close();
    }
  }

  return (
    <div className="mb-6" aria-busy={isPending}>
      {state.successId && state.message && (
        <AdminSuccessNotice key={state.successId} title={state.message} />
      )}

      {state.error && (
        <p
          role="alert"
          className="mb-4 rounded-control border border-red-500/25 bg-red-500/10 p-4 text-sm leading-7"
        >
          {state.error}
        </p>
      )}

      {state.warning && (
        <div className="mb-4 rounded-control border border-amber-500/30 bg-amber-500/10 p-4">
          <p role="alert" className="text-sm leading-7">
            {state.warning}
          </p>

          {state.cleanupSrc && (
            <form action={formAction} className="mt-3">
              <input type="hidden" name="operation" value="cleanup" />
              <input type="hidden" name="src" value={state.cleanupSrc} />

              <button
                type="submit"
                disabled={isPending}
                className={controlClassName}
              >
                {isPending ? "جارٍ التنظيف..." : "إعادة محاولة التنظيف"}
              </button>
            </form>
          )}
        </div>
      )}

      {images.length === 0 ? (
        <div className="rounded-card border border-dashed border-border bg-surface px-5 py-8 text-center">
          <p className="text-sm text-muted">
            لم تُضف صور لهذا المنتج حتى الآن.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((image, index) => (
            <div
              key={image.id}
              className={`overflow-hidden rounded-2xl border bg-surface ${
                index === 0 ? "border-primary/50" : "border-border"
              }`}
            >
              <div className="relative aspect-square bg-background">
                <Image
                  src={image.src}
                  alt={image.alt || productName}
                  fill
                  sizes="(min-width: 1024px) 210px, (min-width: 640px) 30vw, 45vw"
                  className="object-contain p-2"
                />
              </div>

              <div className="border-t border-border p-3">
                <p
                  className={`mb-3 text-xs font-medium ${
                    index === 0 ? "text-primary" : "text-muted"
                  }`}
                >
                  {index === 0 ? "الصورة الرئيسية" : `الصورة ${index + 1}`}
                </p>

                <form action={formAction}>
                  <input type="hidden" name="image_id" value={image.id} />

                  <fieldset
                    disabled={isPending}
                    className="grid min-w-0 grid-cols-2 gap-2"
                  >
                    <legend className="sr-only">
                      التحكم في الصورة {index + 1}
                    </legend>

                    <button
                      type="submit"
                      name="operation"
                      value="earlier"
                      disabled={index === 0}
                      aria-label={`تقديم الصورة ${index + 1} مكانًا واحدًا`}
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
                      aria-label={`تأخير الصورة ${index + 1} مكانًا واحدًا`}
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
                      {index === 0 ? "الصورة الرئيسية" : "تعيين كرئيسية"}
                    </button>

                    <button
                      type="button"
                      disabled={Boolean(state.cleanupSrc)}
                      onClick={() => openDeleteDialog(image)}
                      aria-label={`حذف الصورة ${index + 1}`}
                      className="col-span-2 inline-flex min-h-10 items-center justify-center gap-2 rounded-control border border-red-500/20 px-2 text-[11px] font-medium text-foreground transition-colors hover:border-red-500/50 hover:bg-red-500/10 disabled:opacity-35"
                    >
                      <FaTrashCan aria-hidden="true" className="size-3" />
                      حذف الصورة
                    </button>
                  </fieldset>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}

      <p role="status" className="mt-3 min-h-6 text-xs leading-6 text-muted">
        {isPending ? "جارٍ حفظ التغييرات..." : ""}
      </p>

      <dialog
        ref={dialogRef}
        aria-labelledby={dialogTitleId}
        aria-describedby={dialogDescriptionId}
        onCancel={(event) => {
          if (isPending) event.preventDefault();
        }}
        className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-card border border-border bg-surface p-6 text-foreground shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm"
      >
        <div className="flex items-center justify-between gap-4">
          <h3 id={dialogTitleId} className="text-lg font-bold">
            حذف الصورة؟
          </h3>

          <button
            type="button"
            onClick={closeDeleteDialog}
            disabled={isPending}
            aria-label="إغلاق"
            className="flex size-10 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-elevated disabled:opacity-50"
          >
            <FaXmark aria-hidden="true" className="size-4" />
          </button>
        </div>

        <p
          id={dialogDescriptionId}
          className="mt-4 text-sm leading-7 text-muted"
        >
          سيتم حذف الصورة من المنتج. لو كانت الصورة الرئيسية، ستصبح الصورة
          التالية هي الرئيسية تلقائيًا.
        </p>

        {state.error && (
          <p
            role="alert"
            className="mt-4 rounded-control border border-red-500/25 bg-red-500/10 p-3 text-sm leading-7"
          >
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
            onClick={closeDeleteDialog}
            disabled={isPending}
            className={`${controlClassName} flex-1 text-sm`}
          >
            إلغاء
          </button>

          <button
            type="submit"
            disabled={isPending || !selectedImage}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-control bg-red-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            {isPending ? "جارٍ الحذف..." : "تأكيد الحذف"}
          </button>
        </form>
      </dialog>
    </div>
  );
}
