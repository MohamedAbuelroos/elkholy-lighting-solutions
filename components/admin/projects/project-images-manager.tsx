"use client";

import Image from "next/image";
import {
  useActionState,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
} from "react";

import { uploadProjectImage } from "@/app/admin/projects/image-actions";
import { AdminSuccessNotice } from "@/components/admin/admin-success-notice";
import { prepareCatalogImage } from "@/lib/images/prepare-catalog-image";
import { PROJECT_IMAGE_CONFIG } from "@/lib/projects/image-config";
import { ProjectImagesGallery } from "@/components/admin/projects/project-images-gallery";

import type {
  AdminProjectImage,
  ProjectImageUploadState,
} from "@/lib/admin/project-image-types";

type ProjectImagesManagerProps = {
  projectId: string;
  projectName: string;
  images: AdminProjectImage[];
  pendingCleanupCount: number;
};

type PreparedImage = {
  file: File;
  previewUrl: string;
  originalBytes: number;
};

const initialState: ProjectImageUploadState = {
  error: null,
  successId: null,
};

function formatSize(bytes: number) {
  return `${Math.ceil(bytes / 1024)} KB`;
}

export function ProjectImagesManager({
  projectId,
  projectName,
  images,
  pendingCleanupCount,
}: ProjectImagesManagerProps) {
  const id = useId();

  const fileRef = useRef<HTMLInputElement>(null);
  const selectionVersion = useRef(0);

  const [prepared, setPrepared] = useState<PreparedImage | null>(null);
  const [selectionError, setSelectionError] = useState<string | null>(null);
  const [isPreparing, setIsPreparing] = useState(false);

  const uploadAction = uploadProjectImage.bind(null, projectId);

  const [state, formAction, isPending] = useActionState(
    async (
      previousState: ProjectImageUploadState,
      formData: FormData,
    ): Promise<ProjectImageUploadState> => {
      if (!prepared) {
        return {
          error: "اختر صورة أولًا.",
          successId: null,
        };
      }

      const payload = new FormData();

      payload.set("image", prepared.file);

      const alt = formData.get("alt");
      payload.set("alt", typeof alt === "string" ? alt : "");

      const result = await uploadAction(previousState, payload);

      if (result.successId) {
        selectionVersion.current += 1;
        setPrepared(null);
        setSelectionError(null);

        if (fileRef.current) {
          fileRef.current.value = "";
        }
      }

      return result;
    },
    initialState,
  );

  useEffect(() => {
    return () => {
      if (prepared) {
        URL.revokeObjectURL(prepared.previewUrl);
      }
    };
  }, [prepared]);

  useEffect(() => {
    return () => {
      selectionVersion.current += 1;
    };
  }, []);

  const hasReachedLimit = images.length >= PROJECT_IMAGE_CONFIG.maxImages;

  const busy = isPending || isPreparing;

  async function selectImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    const version = ++selectionVersion.current;

    setPrepared(null);
    setSelectionError(null);

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

      if (fileRef.current) {
        fileRef.current.value = "";
      }

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

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  }

  return (
    <section
      aria-labelledby={`${id}-title`}
      className="mt-10 max-w-4xl rounded-card border border-border bg-surface p-5 sm:p-8"
    >
      {state.successId && (
        <AdminSuccessNotice
          key={state.successId}
          title="تمت إضافة صورة المشروع."
        />
      )}

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id={`${id}-title`} className="text-lg font-semibold">
            صور المشروع
          </h2>

          <p className="mt-2 text-xs leading-6 text-muted">
            حتى 10 صور. أول صورة في الترتيب هي غلاف المشروع.
          </p>
        </div>

        <span className="rounded-full border border-border bg-background px-3 py-1.5 text-xs tabular-nums text-muted">
          {images.length} / {PROJECT_IMAGE_CONFIG.maxImages}
        </span>
      </div>

      <ProjectImagesGallery
        projectId={projectId}
        projectName={projectName}
        images={images}
        pendingCleanupCount={pendingCleanupCount}
      />

      {!hasReachedLimit ? (
        <form action={formAction} className="mt-7 border-t border-border pt-6">
          <fieldset disabled={busy} className="min-w-0">
            <legend className="sr-only">رفع صورة للمشروع</legend>

            <label htmlFor={`${id}-file`} className="text-sm font-medium">
              إضافة صورة جديدة
            </label>

            <input
              ref={fileRef}
              id={`${id}-file`}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={selectImage}
              className="mt-3 block w-full text-sm text-muted file:me-3 file:rounded-control file:border-0 file:bg-background file:px-4 file:py-3 file:text-foreground"
            />

            <p className="mt-3 text-xs leading-6 text-muted">
              تُضغط الصورة وتتحول إلى WebP تلقائيًا قبل رفعها. الحد الأقصى
              للنسخة المرفوعة 500 KB.
            </p>

            {prepared && (
              <div className="mt-5 grid items-start gap-5 sm:grid-cols-2">
                <div>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-primary/30 bg-background">
                    <Image
                      src={prepared.previewUrl}
                      alt="معاينة الصورة الجديدة"
                      fill
                      unoptimized
                      sizes="400px"
                      className="object-contain"
                    />
                  </div>

                  <p className="mt-3 text-xs leading-6 text-muted">
                    قبل الضغط: {formatSize(prepared.originalBytes)}
                    {" · "}
                    بعد الضغط: {formatSize(prepared.file.size)}
                  </p>
                </div>

                <div>
                  <label htmlFor={`${id}-alt`} className="text-sm font-medium">
                    وصف الصورة — اختياري
                  </label>

                  <input
                    id={`${id}-alt`}
                    name="alt"
                    maxLength={200}
                    placeholder="مثل: توزيع الإضاءة في غرفة المعيشة"
                    className="mt-2 min-h-12 w-full rounded-control border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                  />

                  <p className="mt-2 text-xs leading-6 text-muted">
                    وصف مختصر لمحتوى الصورة، لمساعدة مستخدمي قارئ الشاشة.
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      type="submit"
                      className="min-h-11 rounded-control bg-primary px-5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover disabled:opacity-60"
                    >
                      {isPending ? "جارٍ الرفع..." : "رفع الصورة"}
                    </button>

                    <button
                      type="button"
                      onClick={clearSelection}
                      className="min-h-11 rounded-control border border-border px-5 text-sm text-muted"
                    >
                      إلغاء الاختيار
                    </button>
                  </div>
                </div>
              </div>
            )}
          </fieldset>

          {isPreparing && (
            <p role="status" className="mt-4 text-sm text-muted">
              جارٍ ضغط الصورة وتجهيزها...
            </p>
          )}

          {isPending && (
            <p role="status" className="mt-4 text-sm text-muted">
              جارٍ رفع الصورة وحفظها...
            </p>
          )}
        </form>
      ) : (
        <p className="mt-6 rounded-control border border-primary/25 bg-primary/5 p-4 text-sm leading-7">
          وصلت للحد الأقصى: 10 صور لهذا المشروع.
        </p>
      )}

      {(selectionError || state.error) && (
        <p
          role="alert"
          className="mt-5 rounded-control border border-red-500/30 bg-red-500/10 p-4 text-sm leading-7"
        >
          {selectionError ?? state.error}
        </p>
      )}
    </section>
  );
}
