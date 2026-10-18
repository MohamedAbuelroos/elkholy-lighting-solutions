import type { Category } from "@/types/category";

export const categories = [
  {
    id: "a1000000-0000-4000-8000-000000000001",
    name_ar: "الإضاءة",
    name_en: "Lighting",
    slug: "lighting",
    description_ar:
      "من النجف المودرن والكلاسيك إلى الأباليك والاسبوتات والإضاءة الداخلية والخارجية، تفاصيل تكمّل جمال كل مساحة.",
    description_en: null,
    image_path: "/images/categories/1.png",
    parent_id: null,
    sort_order: 1,
    is_active: true,
  },
  {
    id: "a1000000-0000-4000-8000-000000000002",
    name_ar: "المفاتيح والتشطيبات الكهربائية",
    name_en: "Switches & Electrical",
    slug: "electrical",
    description_ar:
      "مفاتيح وبرايز وتجهيزات كهربائية تجمع بين جودة الاستخدام وأناقة التصميم.",
    description_en: null,
    image_path: "/images/categories/2.png",
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
      "تحكم ذكي في الإضاءة والأجهزة لتجربة منزلية أكثر راحة وسهولة.",
    description_en: null,
    image_path: "/images/categories/3.png",
    parent_id: null,
    sort_order: 3,
    is_active: true,
  },
  {
    id: "a1000000-0000-4000-8000-000000000004",
    name_ar: "الأقفال الذكية",
    name_en: "Smart Locks",
    slug: "smart-locks",
    description_ar:
      "حلول ذكية للتحكم في دخول المنزل تجمع بين الأمان وسهولة الاستخدام.",
    description_en: null,
    image_path: "/images/categories/4.png",
    parent_id: null,
    sort_order: 4,
    is_active: true,
  },
  {
    id: "a1000000-0000-4000-8000-000000000005",
    name_ar: "الأنظمة الصوتية",
    name_en: "Sound Systems",
    slug: "sound-systems",
    description_ar:
      "حلول صوتية وسماعات تضيف تجربة صوتية متكاملة للمنازل والمشروعات.",
    description_en: null,
    image_path: "/images/categories/5.png",
    parent_id: null,
    sort_order: 5,
    is_active: true,
  },
] satisfies Category[];
