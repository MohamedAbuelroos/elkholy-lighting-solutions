export type CategoryFormState = {
  error: string | null;
};

export type CategoryFormValues = {
  name_ar: string;
  name_en: string;
  slug: string;
  description_ar: string;
  description_en: string;
  parent_id: string;
  sort_order: string;
  is_active: boolean;
};