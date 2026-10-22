export type ProjectImage = {
  id: string;
  src: string;
  alt: string;
};

export type Project = {
  id: string;

  title_ar: string;
  title_en: string | null;

  description_ar: string;
  description_en: string | null;

  category_ar: string;
  category_en: string | null;

  images: ProjectImage[];

  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
};
