export type ProductImage = {
  src: string;
  alt: string;
};

export type Product = {
  id: string;
  slug: string;
  category_id: string;

  name_ar: string;
  name_en: string | null;

  description_ar: string;
  description_en: string | null;

  sku: string | null;
  price: number | null;

  images: ProductImage[];

  is_active: boolean;
  is_featured: boolean;
  is_popular: boolean;
  sort_order: number;
};
