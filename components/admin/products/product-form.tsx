"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import type { Category } from "@/types/category";
import type {
  ProductFormState,
  ProductFormValues,
} from "@/lib/admin/product-form-types";

type ProductFormProps = {
  categories: Category[];
  action: (
    state: ProductFormState,
    formData: FormData,
  ) => Promise<ProductFormState>;
  initialValues?: ProductFormValues;
  submitLabel?: string;
  notice?: string;
};

type TextField = {
  name: "name_ar" | "name_en" | "slug" | "sku";
  label: string;
  placeholder: string;
  dir: "rtl" | "ltr";
  required: boolean;
  maxLength: number;
};

const textFields: TextField[] = [
  {
    name: "name_ar",
    label: "اسم المنتج بالعربي",
    placeholder: "مثل: أبليك حائط مودرن",
    dir: "rtl",
    required: true,
    maxLength: 200,
  },
  {
    name: "name_en",
    label: "الاسم بالإنجليزي — اختياري",
    placeholder: "Modern Wall Light",
    dir: "ltr",
    required: false,
    maxLength: 200,
  },
  {
    name: "slug",
    label: "رابط المنتج",
    placeholder: "modern-wall-light",
    dir: "ltr",
    required: true,
    maxLength: 150,
  },
  {
    name: "sku",
    label: "كود المنتج — اختياري",
    placeholder: "WL-001",
    dir: "ltr",
    required: false,
    maxLength: 100,
  },
];

const flags = [
  {
    name: "is_featured",
    title: "منتج مختار",
    description: "إدراجه ضمن المنتجات المختارة بعد نشره.",
  },
  {
    name: "is_popular",
    title: "منتج شائع",
    description: "إدراجه ضمن الأكثر شيوعًا بعد نشره.",
  },
] as const;

const emptyValues: ProductFormValues = {
  name_ar: "",
  name_en: "",
  slug: "",
  category_id: "",
  description_ar: "",
  description_en: "",
  sku: "",
  price: "",
  discount_percent: "0",
  sort_order: "0",
  is_featured: false,
  is_popular: false,
};

const initialState: ProductFormState = {
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
  let hasHiddenCategory = false;

  while (current && !visited.has(current.id)) {
    visited.add(current.id);
    names.unshift(current.name_ar);

    if (!current.is_active) hasHiddenCategory = true;

    current = current.parent_id
      ? categoriesById.get(current.parent_id)
      : undefined;
  }

  return `${names.join(" / ")}${hasHiddenCategory ? " — مخفية عن الزوار" : ""}`;
}

export function ProductForm({
  categories,
  action,
  initialValues = emptyValues,
  submitLabel = "حفظ كمسودة",
  notice = "سيتم حفظ المنتج كمسودة مخفية. بعد الحفظ، افتح التعديل لإضافة الصور ونشره.",
}: ProductFormProps) {
  const [values, setValues] = useState(initialValues);
  const [state, formAction, isPending] = useActionState(action, initialState);

  const categoriesById = new Map(
    categories.map((category) => [category.id, category]),
  );

  function updateField<K extends keyof ProductFormValues>(
    field: K,
    value: ProductFormValues[K],
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
        <legend className="sr-only">بيانات المنتج</legend>

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
                pattern={
                  field.name === "slug" ? "[a-z0-9]+(-[a-z0-9]+)*" : undefined
                }
                title={
                  field.name === "slug"
                    ? "حروف إنجليزية صغيرة وأرقام، وشرطة بين الكلمات"
                    : undefined
                }
                autoCapitalize={field.name === "slug" ? "none" : undefined}
                spellCheck={
                  field.name === "slug" || field.name === "sku"
                    ? false
                    : undefined
                }
                onChange={(event) =>
                  updateField(
                    field.name,
                    field.name === "slug"
                      ? event.target.value.toLowerCase()
                      : event.target.value,
                  )
                }
                className={inputClassName}
              />
            </div>
          ))}

          <div className="sm:col-span-2">
            <label htmlFor="category_id" className="text-sm font-medium">
              فئة المنتج
              <span className="ms-1 text-primary">*</span>
            </label>

            <select
              id="category_id"
              name="category_id"
              required
              value={values.category_id}
              onChange={(event) =>
                updateField("category_id", event.target.value)
              }
              aria-describedby="category-help"
              className={inputClassName}
            >
              <option value="">اختر الفئة المناسبة</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {getCategoryLabel(category, categoriesById)}
                </option>
              ))}
            </select>

            <p id="category-help" className="mt-2 text-xs leading-6 text-muted">
              اختَر أدق فئة مناسبة، مثل الإضاءة / الإضاءة الداخلية / الأباليك.
              المنتج سيظهر أيضًا ضمن الفئات الأعلى بعد نشره.
            </p>
          </div>

          <div>
            <label htmlFor="price" className="text-sm font-medium">
              السعر بالجنيه المصري — اختياري
            </label>

            <input
              id="price"
              name="price"
              type="number"
              dir="ltr"
              min={0}
              max="9999999999.99"
              step="0.01"
              value={values.price}
              onChange={(event) => updateField("price", event.target.value)}
              placeholder="1250"
              aria-describedby="price-help"
              className={inputClassName}
            />

            <p id="price-help" className="mt-2 text-xs leading-6 text-muted">
              اتركه فارغًا لإظهار «السعر عند الاستفسار».
            </p>
          </div>
          <div>
            <label htmlFor="discount_percent" className="text-sm font-medium">
              نسبة الخصم — اختياري
            </label>

            <div className="relative">
              <input
                id="discount_percent"
                name="discount_percent"
                type="number"
                dir="ltr"
                min={0}
                max={99}
                step={1}
                required
                value={values.discount_percent}
                onChange={(event) =>
                  updateField("discount_percent", event.target.value)
                }
                aria-describedby="discount-help"
                className={`${inputClassName} pl-10`}
              />

              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-3 left-4 text-sm text-muted"
              >
                %
              </span>
            </div>

            <p id="discount-help" className="mt-2 text-xs leading-6 text-muted">
              اكتب نسبة من 0 إلى 99. الصفر يعني بدون خصم، ويلزم تحديد سعر لتطبيق
              الخصم.
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
              الرقم الأقل يظهر أولًا في الترتيب الافتراضي للكتالوج.
            </p>
          </div>

          <div>
            <label htmlFor="description_ar" className="text-sm font-medium">
              الوصف بالعربي — اختياري
            </label>

            <textarea
              id="description_ar"
              name="description_ar"
              rows={5}
              maxLength={10000}
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
              rows={5}
              maxLength={10000}
              value={values.description_en}
              onChange={(event) =>
                updateField("description_en", event.target.value)
              }
              className={`${inputClassName} resize-y`}
            />
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {flags.map((flag) => (
            <label
              key={flag.name}
              className="flex cursor-pointer items-start gap-3 rounded-control border border-border bg-background p-4"
            >
              <input
                type="checkbox"
                name={flag.name}
                checked={values[flag.name]}
                onChange={(event) =>
                  updateField(flag.name, event.target.checked)
                }
                className="mt-1 size-4 shrink-0 accent-primary"
              />

              <span>
                <span className="block text-sm font-medium">{flag.title}</span>

                <span className="mt-1 block text-xs leading-6 text-muted">
                  {flag.description}
                </span>
              </span>
            </label>
          ))}
        </div>

        <p className="mt-6 rounded-control border border-primary/20 bg-primary/5 p-4 text-sm leading-7 text-muted">
          {notice}
        </p>
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
            href="/admin/products"
            className="inline-flex min-h-12 items-center justify-center rounded-control border border-border px-6 text-sm text-muted transition-colors hover:text-foreground"
          >
            إلغاء والعودة
          </Link>
        )}
      </div>
    </form>
  );
}
