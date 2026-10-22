"use client";

import Image from "next/image";
import { useActionState, useEffect, useId, useRef, useState } from "react";

import { uploadProductImage } from "@/app/admin/products/image-actions";
import { AdminSuccessNotice } from "@/components/admin/admin-success-notice";
import type {
  AdminProductImage,
  ProductImageUploadState,
} from "@/lib/admin/product-image-types";
import { PRODUCT_IMAGE_CONFIG } from "@/lib/products/image-config";
import { prepareProductImage } from "@/lib/products/prepare-product-image";
import { ProductImagesGallery } from "@/components/admin/products/product-images-gallery";

type ProductImagesManagerProps = {
  productId: string;
  productName: string;
  images: AdminProductImage[];
};

type PreparedImage = {
  file: File;
  previewUrl: string;
  originalBytes: number;
};

const initialState: ProductImageUploadState = {
  error: null,
  successId: null,
};

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export function ProductImagesManager({
  productId,
  productName,
  images,
}: ProductImagesManagerProps) {
  const [prepared, setPrepared] = useState<PreparedImage | null>(null);
  const [selectionError, setSelectionError] = useState<string | null>(null);
  const [isPreparing, setIsPreparing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectionVersion = useRef(0);

  const sectionId = useId();
  const fileId = useId();
  const altId = useId();

  const limitReached = images.length >= PRODUCT_IMAGE_CONFIG.maxImages;

  useEffect(() => {
    if (!prepared) return;

    return () => URL.revokeObjectURL(prepared.previewUrl);
  }, [prepared]);

  useEffect(() => {
    return () => {
      selectionVersion.current += 1;
    };
  }, []);

  async function handleFileSelection(file: File | undefined) {
    const version = ++selectionVersion.current;

    setPrepared(null);
    setSelectionError(null);
    setIsPreparing(false);

    if (!file) return;

    setIsPreparing(true);

    try {
      const optimizedFile = await prepareProductImage(file);

      if (version !== selectionVersion.current) return;

      setPrepared({
        file: optimizedFile,
        previewUrl: URL.createObjectURL(optimizedFile),
        originalBytes: file.size,
      });
    } catch (error) {
      if (version !== selectionVersion.current) return;

      setSelectionError(
        error instanceof Error ? error.message : "تعذّر تجهيز الصورة.",
      );
    } finally {
      if (version === selectionVersion.current) {
        setIsPreparing(false);
      }
    }
  }

  async function submitImage(
    previousState: ProductImageUploadState,
    formData: FormData,
  ): Promise<ProductImageUploadState> {
    if (!prepared) {
      return {
        error: "اختر صورة وانتظر انتهاء تجهيزها.",
        successId: null,
      };
    }

    // إرسال النسخة المضغوطة فقط.
    const payload = new FormData();
    payload.set("image", prepared.file);

    const alt = formData.get("alt");

    payload.set("alt", typeof alt === "string" ? alt : "");

    const result = await uploadProductImage(productId, previousState, payload);

    if (result.successId) {
      setPrepared(null);
      setSelectionError(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }

    return result;
  }

  const [state, formAction, isPending] = useActionState(
    submitImage,
    initialState,
  );

  const error = selectionError ?? state.error;
  const isBusy = isPreparing || isPending;

  return (
    <section aria-labelledby={sectionId} className="mt-12 max-w-4xl">
      {state.successId && (
        <AdminSuccessNotice
          key={state.successId}
          title="تم رفع الصورة بنجاح"
          description="تمت إضافتها إلى صور المنتج."
        />
      )}

      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id={sectionId} className="text-xl font-bold">
            صور المنتج
          </h2>

          <p className="mt-2 text-sm leading-7 text-muted">
            أول صورة هي المستخدمة على كروت المنتج في الموقع.
          </p>
        </div>

        <span className="rounded-full border border-border bg-surface px-4 py-2 text-xs text-muted">
          {images.length} / {PRODUCT_IMAGE_CONFIG.maxImages} صور
        </span>
      </div>

      <ProductImagesGallery
        productId={productId}
        productName={productName}
        images={images}
      />

      {limitReached ? (
        <p
          role="status"
          className="rounded-control border border-border bg-surface p-4 text-sm leading-7 text-muted"
        >
          وصلت للحد الأقصى: خمس صور لهذا المنتج.
        </p>
      ) : (
        <form
          action={formAction}
          aria-busy={isBusy}
          className="rounded-card border border-border bg-surface p-5 sm:p-6"
        >
          <fieldset disabled={isBusy} className="min-w-0">
            <legend className="sr-only">رفع صورة للمنتج</legend>

            <label htmlFor={fileId} className="text-sm font-medium">
              اختيار صورة جديدة
            </label>

            <input
              ref={fileInputRef}
              id={fileId}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={(event) => {
                void handleFileSelection(event.target.files?.[0]);
              }}
              className="mt-3 block w-full rounded-control border border-border bg-background p-3 text-sm text-muted file:me-4 file:rounded-full file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-primary"
            />

            <p className="mt-2 text-xs leading-6 text-muted">
              JPG أو PNG أو WebP أو AVIF. يتم تصغير الصورة وضغطها تلقائيًا قبل
              رفعها.
            </p>

            {prepared && (
              <div className="mt-5 flex flex-col gap-4 rounded-control border border-border bg-background p-4 sm:flex-row sm:items-center">
                <div className="relative size-32 shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src={prepared.previewUrl}
                    alt="معاينة الصورة بعد الضغط"
                    fill
                    unoptimized
                    sizes="128px"
                    className="object-contain"
                  />
                </div>

                <div className="text-sm leading-7">
                  <p className="font-semibold text-foreground">
                    الصورة جاهزة للرفع
                  </p>

                  <p className="mt-1 text-xs text-muted">
                    قبل الضغط:{" "}
                    <span dir="ltr" className="inline-block">
                      {formatSize(prepared.originalBytes)}
                    </span>
                  </p>

                  <p className="text-xs text-primary">
                    بعد الضغط في المتصفح:{" "}
                    <span dir="ltr" className="inline-block">
                      {formatSize(prepared.file.size)}
                    </span>
                  </p>
                </div>
              </div>
            )}

            <div className="mt-5">
              <label htmlFor={altId} className="text-sm font-medium">
                وصف الصورة — اختياري
              </label>

              <input
                id={altId}
                name="alt"
                maxLength={200}
                placeholder="مثل: أبليك الحائط من الأمام"
                className="mt-2 min-h-12 w-full rounded-control border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
              />

              <p className="mt-2 text-xs leading-6 text-muted">
                لو تركته فارغًا، سيتم استخدام اسم المنتج.
              </p>
            </div>
          </fieldset>

          <p role="status" className="mt-4 text-xs leading-6 text-muted">
            {isPreparing
              ? "جارٍ تجهيز الصورة وضغطها..."
              : isPending
                ? "جارٍ رفع الصورة وحفظها..."
                : ""}
          </p>

          {error && (
            <p
              role="alert"
              className="mt-4 rounded-control border border-red-500/25 bg-red-500/10 p-3 text-sm leading-7 text-foreground"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!prepared || isBusy}
            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-control bg-primary px-6 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "جارٍ الرفع..." : "رفع الصورة"}
          </button>
        </form>
      )}
    </section>
  );
}
