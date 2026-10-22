export type ProjectFormState = {
  error: string | null;
};

export type ProjectFormValues = {
  title_ar: string;
  title_en: string;
  category_ar: string;
  category_en: string;
  description_ar: string;
  description_en: string;
  sort_order: string;
  is_featured: boolean;
};
