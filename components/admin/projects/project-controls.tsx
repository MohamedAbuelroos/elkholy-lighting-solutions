"use client";

import { useActionState, useId, useRef } from "react";

import {
  changeProjectPublication,
  deleteProject,
} from "@/app/admin/projects/control-actions";
import { AdminSuccessNotice } from "@/components/admin/admin-success-notice";
import type { ProjectActionState } from "@/lib/admin/project-action-types";

const initialState: ProjectActionState = {
  error: null,
  successId: null,
  message: null,
};

export function ProjectPublicationControl({
  projectId,
  isActive,
}: {
  projectId: string;
  isActive: boolean;
}) {
  const action = changeProjectPublication.bind(null, projectId);
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <div className="mb-7 max-w-4xl rounded-card border border-border bg-surface p-5">
      {state.successId && state.message && (
        <AdminSuccessNotice key={state.successId} title={state.message} />
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold">حالة المشروع</h2>

          <p className="mt-2 text-xs leading-6 text-muted">
            {isActive
              ? "المشروع منشور ومتاح للاستعلامات العامة."
              : "المشروع مسودة. أضف صوره وراجع بياناته قبل النشر."}
          </p>
        </div>

        <form action={formAction}>
          <button
            type="submit"
            name="operation"
            value={isActive ? "hide" : "publish"}
            disabled={isPending}
            className="min-h-11 rounded-control border border-primary/40 px-5 text-sm font-medium text-primary transition-colors hover:bg-primary/10 disabled:opacity-50"
          >
            {isPending
              ? "جارٍ الحفظ..."
              : isActive
                ? "إخفاء المشروع"
                : "نشر المشروع"}
          </button>
        </form>
      </div>

      {state.error && (
        <p role="alert" className="mt-4 text-sm leading-7">
          {state.error}
        </p>
      )}
    </div>
  );
}

export function DeleteProjectControl({
  projectId,
  projectName,
  isActive,
}: {
  projectId: string;
  projectName: string;
  isActive: boolean;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  const action = deleteProject.bind(null, projectId);

  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <section className="mt-10 max-w-4xl rounded-card border border-red-500/20 bg-surface p-5">
      <h2 className="text-sm font-semibold">حذف المشروع</h2>

      <p className="mt-2 text-xs leading-6 text-muted">
        حذف نهائي لبيانات المشروع وصوره. يمكنك إخفاؤه بدلًا من حذفه.
      </p>

      <button
        type="button"
        disabled={isActive}
        onClick={() => dialogRef.current?.showModal()}
        className="mt-4 min-h-11 rounded-control border border-red-500/30 px-5 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-40"
      >
        حذف المشروع
      </button>

      {isActive && (
        <p className="mt-2 text-xs leading-6 text-muted">
          أخفِ المشروع أولًا لتتمكن من حذفه.
        </p>
      )}

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        onCancel={(event) => {
          if (isPending) event.preventDefault();
        }}
        className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-card border border-border bg-surface p-6 text-foreground backdrop:bg-black/60"
      >
        <h3 id={titleId} className="text-lg font-semibold">
          حذف {projectName}؟
        </h3>

        <p className="mt-3 text-sm leading-7 text-muted">
          سيتم حذف المشروع وكل صوره. لا يمكن التراجع عن هذه العملية.
        </p>

        {state.error && (
          <p role="alert" className="mt-4 text-sm leading-7">
            {state.error}
          </p>
        )}

        <form action={formAction} className="mt-6 flex gap-3">
          <button
            type="button"
            disabled={isPending}
            onClick={() => dialogRef.current?.close()}
            className="min-h-11 flex-1 rounded-control border border-border px-4 text-sm disabled:opacity-50"
          >
            إلغاء
          </button>

          <button
            type="submit"
            disabled={isPending}
            className="min-h-11 flex-1 rounded-control bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
          >
            {isPending ? "جارٍ الحذف..." : "تأكيد الحذف"}
          </button>
        </form>
      </dialog>
    </section>
  );
}
