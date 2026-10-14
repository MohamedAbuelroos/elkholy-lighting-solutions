export type Category = {
  id: string;
  name_ar: string;
  name_en: string | null;
  slug: string;
  description_ar: string | null;
  description_en: string | null;
  image_path: string | null;
  parent_id: string | null;
  sort_order: number;
  is_active: boolean;
};
