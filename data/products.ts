import type { Product } from "@/types/product";

export const products = [
  {
    id: "demo-product-01",
    slug: "modern-pendant-light",
    category_id: "a1000000-0000-4000-8000-000000000001",
    name_ar: "وحدة إضاءة معلّقة مودرن",
    name_en: null,
    description_ar:
      "منتج تجريبي لمعاينة التصميم. يُستبدل الوصف بمواصفات المنتج الفعلية.",
    description_en: null,
    sku: "DEMO-001",
    price: 2450,
    images: [
      {
        src: "/images/categories/lighting.jpg",
        alt: "صورة مؤقتة لقسم الإضاءة",
      },
    ],
    is_active: true,
    is_featured: true,
    is_popular: true,
    sort_order: 1,
  },
  {
    id: "demo-product-02",
    slug: "electrical-switch",
    category_id: "a1000000-0000-4000-8000-000000000002",
    name_ar: "مفتاح كهربائي بتصميم عصري",
    name_en: null,
    description_ar:
      "منتج تجريبي لمعاينة التصميم. تُضاف الخامات والمقاسات الفعلية لاحقًا.",
    description_en: null,
    sku: "DEMO-002",
    price: 350,
    images: [
      {
        src: "/images/categories/electric.jpg",
        alt: "صورة مؤقتة لقسم التشطيبات الكهربائية",
      },
    ],
    is_active: true,
    is_featured: true,
    is_popular: true,
    sort_order: 2,
  },
  {
    id: "demo-product-03",
    slug: "smart-lighting-control",
    category_id: "a1000000-0000-4000-8000-000000000003",
    name_ar: "وحدة تحكم بالإضاءة الذكية",
    name_en: null,
    description_ar:
      "منتج تجريبي لمعاينة التصميم. تُضاف تفاصيل التوافق والتشغيل لاحقًا.",
    description_en: null,
    sku: "DEMO-003",
    price: null,
    images: [
      {
        src: "/images/categories/lighting.jpg",
        alt: "صورة مؤقتة لقسم الأنظمة الذكية",
      },
    ],
    is_active: true,
    is_featured: true,
    is_popular: true,
    sort_order: 3,
  },
  {
    id: "demo-product-04",
    slug: "home-sound-system",
    category_id: "a1000000-0000-4000-8000-000000000004",
    name_ar: "نظام صوتي للمساحات الداخلية",
    name_en: null,
    description_ar:
      "منتج تجريبي لمعاينة التصميم. تُضاف القدرة والمواصفات الفعلية لاحقًا.",
    description_en: null,
    sku: "DEMO-004",
    price: null,
    images: [
      {
        src: "/images/categories/electric.jpg",
        alt: "صورة مؤقتة لقسم الأنظمة الصوتية",
      },
    ],
    is_active: true,
    is_featured: true,
    is_popular: true,
    sort_order: 4,
  },

  {
    id: "demo-product-05",
    slug: "home-sound-system-two",
    category_id: "a1000000-0000-4000-8000-000000000004",
    name_ar: "نظام صوتي للمساحات الداخلية",
    name_en: null,
    description_ar:
      "منتج تجريبي لمعاينة التصميم. تُضاف القدرة والمواصفات الفعلية لاحقًا.",
    description_en: null,
    sku: "DEMO-005",
    price: null,
    images: [
      {
        src: "/images/categories/lighting.jpg",
        alt: "صورة مؤقتة لقسم الأنظمة الصوتية",
      },
    ],
    is_active: true,
    is_featured: true,
    is_popular: true,
    sort_order: 5,
  },
  {
    id: "demo-product-06",
    slug: "home-sound-system-three",
    category_id: "a1000000-0000-4000-8000-000000000004",
    name_ar: "نظام صوتي للمساحات الداخلية",
    name_en: null,
    description_ar:
      "منتج تجريبي لمعاينة التصميم. تُضاف القدرة والمواصفات الفعلية لاحقًا.",
    description_en: null,
    sku: "DEMO-006",
    price: null,
    images: [
      {
        src: "/images/categories/electric.jpg",
        alt: "صورة مؤقتة لقسم الأنظمة الصوتية",
      },
    ],
    is_active: true,
    is_featured: true,
    is_popular: true,
    sort_order: 6,
  },
  {
    id: "demo-product-07",
    slug: "home-sound-system-four",
    category_id: "a1000000-0000-4000-8000-000000000004",
    name_ar: "نظام صوتي للمساحات الداخلية",
    name_en: null,
    description_ar:
      "منتج تجريبي لمعاينة التصميم. تُضاف القدرة والمواصفات الفعلية لاحقًا.",
    description_en: null,
    sku: "DEMO-007",
    price: null,
    images: [
      {
        src: "/images/categories/lighting.jpg",
        alt: "صورة مؤقتة لقسم الأنظمة الصوتية",
      },
    ],
    is_active: true,
    is_featured: true,
    is_popular: true,
    sort_order: 7,
  },
  {
    id: "demo-product-08",
    slug: "home-sound-system-five",
    category_id: "a1000000-0000-4000-8000-000000000004",
    name_ar: "نظام صوتي للمساحات الداخلية",
    name_en: null,
    description_ar:
      "منتج تجريبي لمعاينة التصميم. تُضاف القدرة والمواصفات الفعلية لاحقًا.",
    description_en: null,
    sku: "DEMO-008",
    price: null,
    images: [
      {
        src: "/images/categories/lighting.jpg",
        alt: "صورة مؤقتة لقسم الأنظمة الصوتية",
      },
    ],
    is_active: true,
    is_featured: true,
    is_popular: true,
    sort_order: 8,
  },
] satisfies Product[];
