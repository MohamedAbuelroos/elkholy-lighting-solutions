"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import type {
  ProjectFormState,
  ProjectFormValues,
} from "@/lib/admin/project-form-types";

type ProjectFormProps = {
  action: (
    state: ProjectFormState,
    formData: FormData,
  ) => Promise<ProjectFormState>;
  initialValues?: ProjectFormValues;
  submitLabel?: string;
};

const emptyValues: ProjectFormValues = {
  title_ar: "",
  title_en: "",
  category_ar: "",
  category_en: "",
  description_ar: "",
  description_en: "",
  sort_order: "0",
  is_featured: false,
};

const initialState: ProjectFormState = {
  error: null,
};

const inputClassName =
  "mt-2 min-h-12 w-full rounded-control border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 disabled:opacity-60";

const textFields = [
  {
    name: "title_ar",
    label: "اسم المشروع بالعربي",
    placeholder: "مثل: إضاءة فيلا سكنية بدمنهور",
    maxLength: 160,
    required: true,
    dir: "rtl",
  },
  {
    name: "title_en",
    label: "اسم المشروع بالإنجليزي — اختياري",
    placeholder: "Residential Villa Lighting",
    maxLength: 160,
    required: false,
    dir: "ltr",
  },
  {
    name: "category_ar",
    label: "نوع المشروع بالعربي",
    placeholder: "مثل: إضاءة سكنية",
    maxLength: 100,
    required: true,
    dir: "rtl",
  },
  {
    name: "category_en",
    label: "نوع المشروع بالإنجليزي — اختياري",
    placeholder: "Residential Lighting",
    maxLength: 100,
    required: false,
    dir: "ltr",
  },
] as const;

const descriptionFields = [
  {
    name: "description_ar",
    label: "وصف المشروع بالعربي — اختياري",
    dir: "rtl",
  },
  {
    name: "description_en",
    label: "وصف المشروع بالإنجليزي — اختياري",
    dir: "ltr",
  },
] as const;

export function ProjectForm({
  action,
  initialValues = emptyValues,
  submitLabel = "حفظ المشروع",
}: ProjectFormProps) {
  const [values, setValues] = useState(initialValues);
  const [state, formAction, isPending] = useActionState(action, initialState);

  function updateField<K extends keyof ProjectFormValues>(
    name: K,
    value: ProjectFormValues[K],
  ) {
    setValues((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  return (
    <form action={formAction} className="max-w-4xl">
      <fieldset
        disabled={isPending}
        className="min-w-0 rounded-card border border-border bg-surface p-5 sm:p-8"
      >
        <legend className="sr-only">بيانات المشروع</legend>

        <div className="grid gap-6 sm:grid-cols-2">
          {textFields.map((field) => (
            <div key={field.name}>
              <label htmlFor={field.name} className="text-sm font-medium">
                {field.label}

                {field.required && <span className="ms-1 text-primary">*</span>}
              </label>

              <input
                id={field.name}
                name={field.name}
                dir={field.dir}
                required={field.required}
                maxLength={field.maxLength}
                placeholder={field.placeholder}
                value={values[field.name]}
                onChange={(event) =>
                  updateField(field.name, event.target.value)
                }
                className={inputClassName}
              />
            </div>
          ))}

          {descriptionFields.map((field) => (
            <div key={field.name}>
              <label htmlFor={field.name} className="text-sm font-medium">
                {field.label}
              </label>

              <textarea
                id={field.name}
                name={field.name}
                dir={field.dir}
                rows={5}
                maxLength={5000}
                value={values[field.name]}
                onChange={(event) =>
                  updateField(field.name, event.target.value)
                }
                className={`${inputClassName} resize-y`}
              />
            </div>
          ))}

          <div>
            <label htmlFor="sort_order" className="text-sm font-medium">
              ترتيب الظهور
            </label>

            <input
              id="sort_order"
              name="sort_order"
              type="number"
              min={0}
              max={100000}
              step={1}
              required
              value={values.sort_order}
              onChange={(event) =>
                updateField("sort_order", event.target.value)
              }
              aria-describedby="project-sort-help"
              className={inputClassName}
            />

            <p
              id="project-sort-help"
              className="mt-2 text-xs leading-6 text-muted"
            >
              الرقم الأقل يظهر أولًا.
            </p>
          </div>
        </div>

        <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-control border border-border bg-background p-4">
          <input
            type="checkbox"
            name="is_featured"
            checked={values.is_featured}
            onChange={(event) =>
              updateField("is_featured", event.target.checked)
            }
            className="mt-1 size-4 shrink-0 accent-primary"
          />

          <span>
            <span className="block text-sm font-medium">
              ضمن اختيارات الصفحة الرئيسية
            </span>

            <span className="mt-1 block text-xs leading-6 text-muted">
              عند ربط الموقع، ستعرض الرئيسية أول 3 مشاريع منشورة ومختارة، حسب
              ترتيب الظهور.
            </span>
          </span>
        </label>

        <p className="mt-5 text-xs leading-6 text-muted">
          نوع المشروع وصف للمجال الذي نُفّذ فيه العمل، وليس فئة من فئات
          المنتجات. مثال: إضاءة سكنية أو مشروع تجاري.
        </p>
      </fieldset>

      {state.error && (
        <p
          role="alert"
          className="mt-5 rounded-control border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm leading-7"
        >
          {state.error}
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex min-h-12 items-center justify-center rounded-control bg-primary px-7 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover disabled:cursor-wait disabled:opacity-60"
        >
          {isPending ? "جارٍ الحفظ..." : submitLabel}
        </button>

        {!isPending && (
          <Link
            href="/admin/projects"
            className="inline-flex min-h-12 items-center justify-center rounded-control border border-border px-6 text-sm text-muted transition-colors hover:text-foreground"
          >
            العودة للمشاريع
          </Link>
        )}
      </div>
    </form>
  );
}
