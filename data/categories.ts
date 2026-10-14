import type { Category } from "@/types/category";

export const categories = [
  {
    id: "a1000000-0000-4000-8000-000000000001",
    name_ar: "الإضاءة",
    name_en: "Lighting",
    slug: "lighting",
    description_ar:
      "نجف ووحدات إضاءة داخلية وخارجية تمنح كل مساحة طابعها الخاص.",
    description_en: null,
    image_path: "/images/categories/lighting.jpg",
    parent_id: null,
    sort_order: 1,
    is_active: true,
  },
  {
    id: "a1000000-0000-4000-8000-000000000002",
    name_ar: "التشطيبات الكهربائية",
    name_en: "Electrical Solutions",
    slug: "electrical",
    description_ar:
      "مفاتيح وبرايز وحلول كهربائية تجمع بين الاستخدام العملي والتصميم المتناسق.",
    description_en: null,
    image_path: "/images/categories/electric.jpg",
    parent_id: null,
    sort_order: 2,
    is_active: true,
  },
  {
    id: "a1000000-0000-4000-8000-000000000003",
    name_ar: "الأنظمة الذكية",
    name_en: "Smart Home",
    slug: "smart-home",
    description_ar:
      "تحكم في الإضاءة وحلول الأمان والأقفال الذكية لحياة أكثر راحة.",
    description_en: null,
    image_path: "/images/categories/lighting.jpg",
    parent_id: null,
    sort_order: 3,
    is_active: true,
  },
  {
    id: "a1000000-0000-4000-8000-000000000004",
    name_ar: "الأنظمة الصوتية",
    name_en: "Sound Systems",
    slug: "sound-systems",
    description_ar:
      "سماعات وحلول صوتية تتناسب مع احتياجات منزلك أو مساحتك التجارية.",
    description_en: null,
    image_path: "/images/categories/lighting.jpg",
    parent_id: null,
    sort_order: 4,
    is_active: true,
  },
] satisfies Category[];
