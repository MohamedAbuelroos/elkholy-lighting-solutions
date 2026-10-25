"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import type { Category } from "@/types/category";
import type {
  CategoryFormState,
  CategoryFormValues,
} from "@/lib/admin/category-form-types";

type CategoryFormProps = {
  categories: Category[];
  action: (
    state: CategoryFormState,
    formData: FormData,
  ) => Promise<CategoryFormState>;
  initialValues?: CategoryFormValues;
  submitLabel?: string;
};

const emptyValues: CategoryFormValues = {
  name_ar: "",
  name_en: "",
  slug: "",
  description_ar: "",
  description_en: "",
  parent_id: "",
  sort_order: "0",
  is_active: true,
};

const initialState: CategoryFormState = {
  error: null,
};

const inputClassName =
  "mt-2 min-h-12 w-full rounded-control border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 disabled:opacity-60";

function getCategoryLabel(
  category: Category,
  categoriesById: Map<string, Category>,
): string {
  const names: string[] = [];
  const visited = new Set<string>();

  let current: Category | undefined = category;

  while (current && !visited.has(current.id)) {
    visited.add(current.id);
    names.unshift(current.name_ar);

    current = current.parent_id
      ? categoriesById.get(current.parent_id)
      : undefined;
  }

  return `${names.join(" / ")}${category.is_active ? "" : " — غير نشطة"}`;
}

export function CategoryForm({
  categories,
  action,
  initialValues = emptyValues,
  submitLabel = "حفظ الفئة",
}: CategoryFormProps) {
  const [values, setValues] = useState(initialValues);
  const [state, formAction, isPending] = useActionState(action, initialState);

  const categoriesById = new Map(
    categories.map((category) => [category.id, category]),
  );

  function updateField<K extends keyof CategoryFormValues>(
    field: K,
    value: CategoryFormValues[K],
  ) {
    setValues((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  return (
    <form action={formAction} className="max-w-4xl">
      <fieldset
        disabled={isPending}
        className="min-w-0 rounded-card border border-border bg-surface p-5 sm:p-8"
      >
        <legend className="sr-only">بيانات الفئة</legend>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="name_ar" className="text-sm font-medium">
              اسم الفئة بالعربي
              <span className="ms-1 text-primary">*</span>
            </label>

            <input
              id="name_ar"
              name="name_ar"
              required
              maxLength={120}
              value={values.name_ar}
              onChange={(event) => updateField("name_ar", event.target.value)}
              placeholder="مثل: الأباليك"
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="name_en" className="text-sm font-medium">
              الاسم بالإنجليزي — اختياري
            </label>

            <input
              id="name_en"
              name="name_en"
              dir="ltr"
              maxLength={120}
              value={values.name_en}
              onChange={(event) => updateField("name_en", event.target.value)}
              placeholder="Wall Lights"
              className={inputClassName}
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="slug" className="text-sm font-medium">
              رابط الفئة
              <span className="ms-1 text-primary">*</span>
            </label>

            <input
              id="slug"
              name="slug"
              required
              dir="ltr"
              maxLength={100}
              pattern="[a-z0-9]+(-[a-z0-9]+)*"
              title="حروف إنجليزية صغيرة وأرقام، وشرطة بين الكلمات"
              autoCapitalize="none"
              spellCheck={false}
              value={values.slug}
              onChange={(event) =>
                updateField("slug", event.target.value.toLowerCase())
              }
              placeholder="wall-lights"
              aria-describedby="slug-help"
              className={inputClassName}
            />

            <p id="slug-help" className="mt-2 text-xs leading-6 text-muted">
              قيمة فريدة تُستخدم في رابط الفئة. مثال: wall-lights
            </p>
          </div>

          <div>
            <label htmlFor="parent_id" className="text-sm font-medium">
              تابعة لأي فئة؟
            </label>

            <select
              id="parent_id"
              name="parent_id"
              value={values.parent_id}
              onChange={(event) => updateField("parent_id", event.target.value)}
              aria-describedby="parent-help"
              className={inputClassName}
            >
              <option value="">فئة أساسية — بدون فئة أم</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {getCategoryLabel(category, categoriesById)}
                </option>
              ))}
            </select>

            <p id="parent-help" className="mt-2 text-xs leading-6 text-muted">
              لو اخترت فئة أم مخفية، الفئة الجديدة لن تظهر للزوار.
            </p>
          </div>

          <div>
            <label htmlFor="sort_order" className="text-sm font-medium">
              ترتيب الظهور
            </label>

            <input
              id="sort_order"
              name="sort_order"
              type="number"
              required
              min={0}
              max={100000}
              step={1}
              value={values.sort_order}
              onChange={(event) =>
                updateField("sort_order", event.target.value)
              }
              aria-describedby="sort-help"
              className={inputClassName}
            />

            <p id="sort-help" className="mt-2 text-xs leading-6 text-muted">
              الرقم الأقل يظهر أولًا بين الفئات في نفس المستوى.
            </p>
          </div>

          <div>
            <label htmlFor="description_ar" className="text-sm font-medium">
              الوصف بالعربي — اختياري
            </label>

            <textarea
              id="description_ar"
              name="description_ar"
              rows={4}
              maxLength={2000}
              value={values.description_ar}
              onChange={(event) =>
                updateField("description_ar", event.target.value)
              }
              className={`${inputClassName} resize-y`}
            />
          </div>

          <div>
            <label htmlFor="description_en" className="text-sm font-medium">
              الوصف بالإنجليزي — اختياري
            </label>

            <textarea
              id="description_en"
              name="description_en"
              dir="ltr"
              rows={4}
              maxLength={2000}
              value={values.description_en}
              onChange={(event) =>
                updateField("description_en", event.target.value)
              }
              className={`${inputClassName} resize-y`}
            />
          </div>
        </div>

        <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-control border border-border bg-background p-4">
          <input
            type="checkbox"
            name="is_active"
            checked={values.is_active}
            onChange={(event) => updateField("is_active", event.target.checked)}
            className="mt-1 size-4 shrink-0 accent-primary"
          />

          <span>
            <span className="block text-sm font-medium">الفئة نشطة</span>

            <span className="mt-1 block text-xs leading-6 text-muted">
              إلغاء التفعيل يحفظ الفئة داخل الإدارة ويخفيها عن الزوار.
            </span>
          </span>
        </label>
      </fieldset>

      {state.error && (
        <p
          role="alert"
          className="mt-5 rounded-control border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm leading-7 text-foreground"
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
            href="/admin/categories"
            className="inline-flex min-h-12 items-center justify-center rounded-control border border-border px-6 text-sm text-muted transition-colors hover:text-foreground"
          >
            إلغاء والعودة
          </Link>
        )}
      </div>
    </form>
  );
}
