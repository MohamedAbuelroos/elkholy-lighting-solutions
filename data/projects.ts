import type { Project } from "@/types/project";

export const projectsConfig = {
  isDemo: true,
};

export const projects = [
  {
    id: "demo-project-01",
    slug: "residential-lighting",
    title_ar: "إضاءة تمنح التفاصيل حضورها",
    description_ar:
      "تصوّر لتوزيع الإضاءة داخل مساحة سكنية، يجمع بين الإنارة العامة والإضاءة الموجّهة.",
    category_ar: "إضاءة سكنية",
    image: {
      src: "/images/categories/lighting.jpg",
      alt: "صورة توضيحية لإضاءة مساحة داخلية",
    },
    is_active: true,
    is_featured: true,
    sort_order: 1,
  },
  {
    id: "demo-project-02",
    slug: "electrical-finishing",
    title_ar: "تفاصيل متناسقة مع المكان",
    description_ar:
      "تصوّر للتشطيبات الكهربائية واختيار المفاتيح بما يتكامل مع الخامات وطابع المساحة.",
    category_ar: "تشطيبات كهربائية",
    image: {
      src: "/images/categories/electric.jpg",
      alt: "صورة توضيحية للتشطيبات الكهربائية",
    },
    is_active: true,
    is_featured: true,
    sort_order: 2,
  },
  {
    id: "demo-project-03",
    slug: "integrated-lighting",
    title_ar: "طبقات إضاءة تصنع الأجواء",
    description_ar:
      "تصوّر للجمع بين الإضاءة المعلّقة والمخفية لإبراز التصميم وتوفير أجواء متنوعة.",
    category_ar: "حلول إضاءة متكاملة",
    image: {
      src: "/images/hero - Copy.jpg",
      alt: "صورة توضيحية لوحدات إضاءة داخلية",
    },
    is_active: true,
    is_featured: true,
    sort_order: 3,
  },
] satisfies Project[];
