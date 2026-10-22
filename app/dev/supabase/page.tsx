import { notFound } from "next/navigation";

import { createCatalogClient } from "@/lib/supabase/catalog-client";

export const dynamic = "force-dynamic";

export default async function SupabaseCheckPage() {
  // This diagnostic page is only available through next dev.
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  const supabase = createCatalogClient();

  const { data, error, count } = await supabase
    .from("categories")
    .select("id, name_ar, slug, parent_id, is_active, sort_order", {
      count: "exact",
    })
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    return (
      <main className="min-h-screen bg-background p-6 text-foreground">
        <h1 className="text-xl font-semibold">تعذّر الاتصال أو قراءة الفئات</h1>

        <pre
          dir="ltr"
          className="mt-5 overflow-auto rounded-xl border border-border bg-surface p-4 text-sm"
        >
          {JSON.stringify(
            {
              code: error.code,
              message: error.message,
              details: error.details,
              hint: error.hint,
            },
            null,
            2,
          )}
        </pre>
      </main>
    );
  }

  const categories = data ?? [];
  const rootCategories = categories.filter(
    (category) => category.parent_id === null,
  );

  return (
    <main className="min-h-screen bg-background p-6 text-foreground">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-semibold text-primary">
          اتصال Supabase ناجح
        </h1>

        <p className="mt-4 text-sm leading-7 text-muted">
          إجمالي الفئات المقروءة: {count ?? categories.length}
          <br />
          الفئات الرئيسية: {rootCategories.length}
        </p>

        <ul className="mt-6 space-y-3">
          {categories.map((category) => (
            <li
              key={category.id}
              className="rounded-xl border border-border bg-surface p-4"
            >
              <p className="font-semibold">{category.name_ar}</p>

              <p className="mt-1 text-xs text-muted">
                {category.parent_id ? "فئة فرعية" : "فئة رئيسية"}
              </p>

              <p dir="ltr" className="mt-2 text-start text-xs text-muted">
                {category.slug}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
