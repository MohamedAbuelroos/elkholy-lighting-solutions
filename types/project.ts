export type Project = {
  id: string;
  slug: string;
  title_ar: string;
  description_ar: string;
  category_ar: string;
  image: {
    src: string;
    alt: string;
  };
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
};
