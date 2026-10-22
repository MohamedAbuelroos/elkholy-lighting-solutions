import type { AdminCategory } from "@/lib/admin/queries/categories";
import { DeleteCategoryButton } from "@/components/admin/categories/delete-category-button";
import Link from "next/link";
type CategoriesTableProps = {
  categories: AdminCategory[];
};

type CategoryRow = {
  category: AdminCategory;
  depth: number;
};

function buildRows(categories: AdminCategory[]): CategoryRow[] {
  const children = new Map<string | null, AdminCategory[]>();

  for (const category of categories) {
    const siblings = children.get(category.parent_id) ?? [];
    siblings.push(category);
    children.set(category.parent_id, siblings);
  }

  const rows: CategoryRow[] = [];
  const visited = new Set<string>();

  function visit(parentId: string | null, depth: number) {
    for (const category of children.get(parentId) ?? []) {
      if (visited.has(category.id)) continue;

      visited.add(category.id);
      rows.push({ category, depth });
      visit(category.id, depth + 1);
    }
  }

  visit(null, 0);

  // Keep unexpected disconnected records visible to the administrator.
  for (const category of categories) {
    if (visited.has(category.id)) continue;

    visited.add(category.id);
    rows.push({ category, depth: 0 });
    visit(category.id, 1);
  }

  return rows;
}

export function CategoriesTable({ categories }: CategoriesTableProps) {
  const rows = buildRows(categories);

  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-surface px-6 py-14 text-center">
        <h2 className="font-semibold">لا توجد فئات بعد</h2>
        <p className="mt-3 text-sm text-muted">ستظهر الفئات هنا بعد إضافتها.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-start text-sm">
          <caption className="sr-only">
            الفئات الرئيسية والفرعية وحالتها وعدد منتجاتها المباشرة
          </caption>

          <thead className="border-b border-border bg-surface-elevated">
            <tr className="text-xs text-muted">
              <th scope="col" className="px-5 py-4 text-start font-medium">
                الفئة
              </th>
              <th scope="col" className="px-4 py-4 text-start font-medium">
                الرابط
              </th>
              <th scope="col" className="px-4 py-4 text-start font-medium">
                المنتجات المباشرة
              </th>
              <th scope="col" className="px-4 py-4 text-start font-medium">
                الحالة
              </th>
              <th scope="col" className="px-4 py-4 text-start font-medium">
                الترتيب
              </th>
              <th scope="col" className="px-4 py-4 text-start font-medium">
                الإجراءات
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {rows.map(({ category, depth }) => (
              <tr
                key={category.id}
                className="transition-colors hover:bg-surface-elevated/50"
              >
                <th scope="row" className="px-5 py-4 text-start font-normal">
                  <div style={{ paddingInlineStart: depth * 20 }}>
                    <span className="font-medium text-foreground">
                      {depth > 0 && (
                        <span aria-hidden="true" className="me-2 text-primary">
                          ↳
                        </span>
                      )}
                      {category.name_ar}
                    </span>

                    <p className="mt-1 text-[11px] text-muted">
                      {depth === 0 ? "فئة رئيسية" : `مستوى فرعي ${depth}`}
                    </p>
                  </div>
                </th>

                <td className="px-4 py-4">
                  <span
                    dir="ltr"
                    className="inline-block rounded-md bg-surface-elevated px-2 py-1 text-[11px] text-muted"
                  >
                    {category.slug}
                  </span>
                </td>

                <td className="px-4 py-4 tabular-nums">
                  {category.directProductCount}
                </td>

                <td className="px-4 py-4">
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] ${
                      category.is_active
                        ? "border-primary/20 bg-primary/10 text-primary"
                        : "border-border bg-surface-elevated text-muted"
                    }`}
                  >
                    {category.is_active ? "مفعّلة" : "غير مفعّلة"}
                  </span>
                </td>

                <td className="px-4 py-4 text-muted tabular-nums">
                  {category.sort_order}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/categories/${category.id}/edit`}
                      aria-label={`تعديل ${category.name_ar}`}
                      className="inline-flex min-h-10 items-center justify-center rounded-control border border-border px-4 text-xs font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary"
                    >
                      تعديل
                    </Link>

                    <DeleteCategoryButton
                      categoryId={category.id}
                      categoryName={category.name_ar}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
