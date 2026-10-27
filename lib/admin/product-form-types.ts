export type ProductFormState = {
  error: string | null;
};

export type ProductFormValues = {
  name_ar: string;
  name_en: string;
  slug: string;
  category_id: string;
  description_ar: string;
  description_en: string;
  sku: string;
  price: string;
  discount_percent: string;
  sort_order: string;
  is_featured: boolean;
  is_popular: boolean;
};

export type ProductPublicationState = {
  error: string | null;
  successId: string | null;
  message: string | null;
};
