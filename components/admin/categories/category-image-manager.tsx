"use client";

import Image from "next/image";
import {
  useActionState,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";

import { manageCategoryImage } from "@/app/admin/categories/image-actions";
import { AdminSuccessNotice } from "@/components/admin/admin-success-notice";
import { prepareCatalogImage } from "@/lib/images/prepare-catalog-image";
import type { CategoryImageState } from "@/lib/admin/category-image-types";

type CategoryImageManagerProps = {
  categoryId: string;
  categoryName: string;
  imageSrc: string | null;
};

type PreparedImage = {
  file: File;
  previewUrl: string;
  originalBytes: number;
};

const initialState: CategoryImageState = {
  error: null,
  successId: null,
  message: null,
  warning: null,
};

const buttonClassName =
  "inline-flex min-h-11 items-center justify-center rounded-control border border-border px-5 text-sm font-medium transition-colors hover:border-primary/50 disabled:cursor-wait disabled:opacity-60";

function formatSize(bytes: number) {
  return `${Math.ceil(bytes / 1024)} KB`;
}

export function CategoryImageManager({
  categoryId,
  categoryName,
  imageSrc,
}: CategoryImageManagerProps) {
  const [prepared, setPrepared] = useState<PreparedImage | null>(null);
  const [selectionError, setSelectionError] = useState<string | null>(null);
  const [isPreparing, setIsPreparing] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const selectionVersion = useRef(0);
  const deleteDialogRef = useRef<HTMLDialogElement>(null);

  const action = manageCategoryImage.bind(null, categoryId);

  const [state, formAction, isPending] = useActionState(
    async (
      previousState: CategoryImageState,
      formData: FormData,
    ): Promise<CategoryImageState> => {
      const payload = new FormData();
      const operation = formData.get("operation");

      payload.set("operation", typeof operation === "string" ? operation : "");

      payload.set("expected_src", imageSrc ?? "");

      if (operation === "upload") {
        if (!prepared) {
          return {
            ...initialState,
            error: "اختر صورة أولًا.",
          };
        }

        payload.set("image", prepared.file);
      }

      return action(previousState, payload);
    },
    initialState,
  );

  useEffect(() => {
    return () => {
      if (prepared) URL.revokeObjectURL(prepared.previewUrl);
    };
  }, [prepared]);

  useEffect(() => {
    return () => {
      selectionVersion.current += 1;
    };
  }, []);

  const busy = isPreparing || isPending;

  async function selectImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    const version = ++selectionVersion.current;

    setSelectionError(null);
    setPrepared(null);

    if (!file) {
      setIsPreparing(false);
      return;
    }

    setIsPreparing(true);

    try {
      const compressed = await prepareCatalogImage(file);

      if (version !== selectionVersion.current) return;

      setPrepared({
        file: compressed,
        previewUrl: URL.createObjectURL(compressed),
        originalBytes: file.size,
      });
    } catch (error) {
      if (version !== selectionVersion.current) return;

      if (fileRef.current) fileRef.current.value = "";

      setSelectionError(
        error instanceof Error ? error.message : "تعذّرت معالجة الصورة.",
      );
    } finally {
      if (version === selectionVersion.current) {
        setIsPreparing(false);
      }
    }
  }

  function clearSelection() {
    selectionVersion.current += 1;
    setPrepared(null);
    setSelectionError(null);

    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <section className="mt-10 max-w-4xl rounded-card border border-border bg-surface p-5 sm:p-8">
      <h2 className="text-lg font-semibold">صورة الفئة</h2>

      <p className="mt-2 text-sm leading-7 text-muted">
        اختر صورة واضحة مناسبة لعرض الفئة. يتم ضغطها وتحويلها إلى WebP تلقائيًا
        قبل الرفع.
      </p>

      {state.successId && (
        <AdminSuccessNotice
          key={state.successId}
          title={state.message ?? "تم حفظ التغيير."}
          description="تم تحديث صورة الفئة."
        />
      )}

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <p className="mb-3 text-xs font-medium text-muted">الصورة الحالية</p>

          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-background">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={`صورة ${categoryName}`}
                fill
                sizes="(min-width: 640px) 400px, 100vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted">
                لا توجد صورة لهذه الفئة
              </div>
            )}
          </div>

          {imageSrc && (
            <button
              type="button"
              disabled={busy}
              onClick={() => deleteDialogRef.current?.showModal()}
              className={`${buttonClassName} mt-4 text-red-500`}
            >
              حذف الصورة الحالية
            </button>
          )}
        </div>

        <form action={formAction}>
          <label htmlFor="category-image-file" className="text-sm font-medium">
            {imageSrc ? "اختيار صورة بديلة" : "اختيار صورة"}
          </label>

          <input
            ref={fileRef}
            id="category-image-file"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            disabled={busy}
            onChange={selectImage}
            className="mt-3 block w-full text-sm text-muted file:me-3 file:rounded-control file:border-0 file:bg-background file:px-4 file:py-3 file:text-foreground"
          />

          {isPreparing && (
            <p role="status" className="mt-4 text-sm text-muted">
              جارٍ تجهيز الصورة وضغطها...
            </p>
          )}

          {prepared && (
            <div className="mt-4">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-primary/30 bg-background">
                <Image
                  src={prepared.previewUrl}
                  alt="معاينة الصورة الجديدة"
                  fill
                  unoptimized
                  sizes="400px"
                  className="object-cover"
                />
              </div>

              <p className="mt-3 text-xs leading-6 text-muted">
                قبل الضغط: {formatSize(prepared.originalBytes)}
                {" · "}
                بعد الضغط: {formatSize(prepared.file.size)}
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="submit"
                  name="operation"
                  value="upload"
                  disabled={busy}
                  className="min-h-11 rounded-control bg-primary px-5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover disabled:opacity-60"
                >
                  {isPending ? "جارٍ التنفيذ..." : "حفظ الصورة"}
                </button>

                <button
                  type="button"
                  disabled={busy}
                  onClick={clearSelection}
                  className={buttonClassName}
                >
                  إلغاء الاختيار
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      {(selectionError || state.error) && (
        <p
          role="alert"
          className="mt-5 rounded-control border border-red-500/30 bg-red-500/10 p-4 text-sm leading-7"
        >
          {selectionError ?? state.error}
        </p>
      )}

      {state.warning && (
        <div className="mt-5 rounded-control border border-primary/30 bg-primary/5 p-4">
          <p role="status" className="text-sm leading-7">
            {state.warning}
          </p>

          <form action={formAction} className="mt-3">
            <button
              type="submit"
              name="operation"
              value="cleanup"
              disabled={busy}
              className={buttonClassName}
            >
              إعادة محاولة التنظيف
            </button>
          </form>
        </div>
      )}

      <dialog
        ref={deleteDialogRef}
        aria-labelledby="delete-category-image-title"
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-card border border-border bg-surface p-6 text-foreground backdrop:bg-black/60"
      >
        <h3 id="delete-category-image-title" className="text-lg font-semibold">
          حذف صورة الفئة؟
        </h3>

        <p className="mt-3 text-sm leading-7 text-muted">
          سيتم حذف الصورة الحالية. يمكنك رفع صورة جديدة لاحقًا.
        </p>

        <form action={formAction} className="mt-6 flex flex-wrap gap-3">
          <button
            type="submit"
            name="operation"
            value="remove"
            disabled={busy}
            onClick={() => deleteDialogRef.current?.close()}
            className={`${buttonClassName} border-red-500/30 text-red-500`}
          >
            تأكيد الحذف
          </button>

          <button
            type="button"
            onClick={() => deleteDialogRef.current?.close()}
            className={buttonClassName}
          >
            إلغاء
          </button>
        </form>
      </dialog>
    </section>
  );
}
