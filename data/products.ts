import type { Product } from "@/types/product";
import { CATEGORY_IDS } from "@/data/categories";

type DemoProductInput = Pick<
  Product,
  | "id"
  | "slug"
  | "category_id"
  | "name_ar"
  | "description_ar"
  | "sku"
  | "price"
  | "sort_order"
  | "is_featured"
  | "is_popular"
> & {
  imageSrc: string;
};

/**
 * Produces the same Product shape used by the UI.
 * Shared demo fields are defined once to avoid repetition.
 */
function createDemoProduct({ imageSrc, ...input }: DemoProductInput): Product {
  return {
    ...input,
    name_en: null,
    description_en: null,
    description_ar: `نموذج تجريبي: ${input.description_ar}`,
    images: [
      {
        src: imageSrc,
        alt: `صورة توضيحية مؤقتة للمنتج: ${input.name_ar}`,
      },
    ],
    is_active: true,
  };
}

export const products: Product[] = [
  // Chandeliers
  createDemoProduct({
    id: "demo-product-01",
    slug: "modern-ring-chandelier",
    category_id: CATEGORY_IDS.chandeliers,
    name_ar: "نجفة حلقات مودرن",
    description_ar:
      "تصميم بحلقات معلّقة يناسب غرف المعيشة والاستقبال. تُضاف المقاسات والمواصفات الفعلية لاحقًا.",
    sku: "DEMO-001",
    price: 2450,
    imageSrc: "/images/categories/lighting.jpg",
    is_featured: true,
    is_popular: true,
    sort_order: 1,
  }),

  createDemoProduct({
    id: "demo-product-02",
    slug: "classic-crystal-chandelier",
    category_id: CATEGORY_IDS.chandeliers,
    name_ar: "نجفة كريستال كلاسيك",
    description_ar:
      "وحدة إضاءة بطابع كلاسيكي للمساحات الداخلية. تُحدّد الخامات وعدد مصادر الإضاءة لاحقًا.",
    sku: "DEMO-002",
    price: 5200,
    imageSrc: "/images/categories/1.png",
    is_featured: true,
    is_popular: true,
    sort_order: 2,
  }),

  // Indoor lighting
  createDemoProduct({
    id: "demo-product-03",
    slug: "recessed-ceiling-spotlight",
    category_id: CATEGORY_IDS.spotlights,
    name_ar: "اسبوت سقفي غاطس",
    description_ar:
      "إضاءة مركزة للأسقف الداخلية. تُضاف القدرة ودرجة اللون ومقاس فتحة التركيب لاحقًا.",
    sku: "DEMO-003",
    price: 185,
    imageSrc: "/images/categories/lighting.jpg",
    is_featured: false,
    is_popular: true,
    sort_order: 3,
  }),

  createDemoProduct({
    id: "demo-product-04",
    slug: "concealed-led-strip",
    category_id: CATEGORY_IDS.ledLighting,
    name_ar: "شريط ليد للإضاءة المخفية",
    description_ar:
      "خيار للإضاءة الديكورية داخل التجاويف. تُضاف تفاصيل الطول والقدرة ووحدة التسعير لاحقًا.",
    sku: "DEMO-004",
    price: null,
    imageSrc: "/images/categories/1.png",
    is_featured: false,
    is_popular: false,
    sort_order: 4,
  }),

  createDemoProduct({
    id: "demo-product-05",
    slug: "modern-indoor-wall-light",
    category_id: CATEGORY_IDS.wallLights,
    name_ar: "أبليك داخلي مودرن",
    description_ar:
      "وحدة جدارية للممرات وغرف المعيشة. تُضاف تفاصيل الخامة والأبعاد الفعلية لاحقًا.",
    sku: "DEMO-005",
    price: 780,
    imageSrc: "/images/categories/lighting.jpg",
    is_featured: true,
    is_popular: false,
    sort_order: 5,
  }),

  createDemoProduct({
    id: "demo-product-06",
    slug: "round-ceiling-light",
    category_id: CATEGORY_IDS.ceilingLights,
    name_ar: "وحدة سقف دائرية",
    description_ar:
      "تصميم سقفي بسيط للغرف والمساحات الداخلية. تُضاف القدرة والأبعاد ودرجة الإضاءة لاحقًا.",
    sku: "DEMO-006",
    price: 1150,
    imageSrc: "/images/categories/1.png",
    is_featured: false,
    is_popular: true,
    sort_order: 6,
  }),

  // Outdoor lighting
  createDemoProduct({
    id: "demo-product-07",
    slug: "outdoor-wall-light",
    category_id: CATEGORY_IDS.outdoorLighting,
    name_ar: "وحدة إضاءة جدارية خارجية",
    description_ar:
      "وحدة لإضاءة الجدران الخارجية. تُضاف درجة الحماية وظروف الاستخدام المعتمدة لاحقًا.",
    sku: "DEMO-007",
    price: 950,
    imageSrc: "/images/categories/lighting.jpg",
    is_featured: true,
    is_popular: true,
    sort_order: 7,
  }),

  createDemoProduct({
    id: "demo-product-08",
    slug: "garden-path-light",
    category_id: CATEGORY_IDS.outdoorLighting,
    name_ar: "وحدة إضاءة للممرات والحدائق",
    description_ar:
      "تصميم لإضاءة المسارات الخارجية. تُضاف الأبعاد ودرجة الحماية ومتطلبات التركيب لاحقًا.",
    sku: "DEMO-008",
    price: null,
    imageSrc: "/images/categories/1.png",
    is_featured: false,
    is_popular: false,
    sort_order: 8,
  }),

  // Electrical
  createDemoProduct({
    id: "demo-product-09",
    slug: "modern-double-switch",
    category_id: CATEGORY_IDS.switches,
    name_ar: "مفتاح كهربائي مزدوج",
    description_ar:
      "مفتاح بتصميم عصري للتشطيبات الداخلية. تُضاف بيانات التشغيل والألوان المتاحة لاحقًا.",
    sku: "DEMO-009",
    price: 350,
    imageSrc: "/images/categories/electric.jpg",
    is_featured: true,
    is_popular: true,
    sort_order: 9,
  }),

  createDemoProduct({
    id: "demo-product-10",
    slug: "wall-power-socket",
    category_id: CATEGORY_IDS.sockets,
    name_ar: "بريزة كهربائية جدارية",
    description_ar:
      "مخرج كهربائي للمساحات الداخلية. تُضاف المواصفات الكهربائية والتوافق الفعلي لاحقًا.",
    sku: "DEMO-010",
    price: 290,
    imageSrc: "/images/categories/2.png",
    is_featured: false,
    is_popular: false,
    sort_order: 10,
  }),

  createDemoProduct({
    id: "demo-product-11",
    slug: "electrical-switch-frame",
    category_id: CATEGORY_IDS.electricalAccessories,
    name_ar: "إطار تشطيب للمفاتيح والبرايز",
    description_ar:
      "إطار لتكملة مظهر الوحدات الكهربائية. تُحدّد المقاسات والموديلات المتوافقة لاحقًا.",
    sku: "DEMO-011",
    price: 120,
    imageSrc: "/images/categories/electric.jpg",
    is_featured: false,
    is_popular: false,
    sort_order: 11,
  }),

  // Smart home
  createDemoProduct({
    id: "demo-product-12",
    slug: "smart-lighting-control-panel",
    category_id: CATEGORY_IDS.smartHome,
    name_ar: "لوحة تحكم بالإضاءة الذكية",
    description_ar:
      "واجهة للتحكم بالإضاءة. تُضاف بروتوكولات الاتصال والأنظمة المتوافقة لاحقًا.",
    sku: "DEMO-012",
    price: 1850,
    imageSrc: "/images/categories/3.png",
    is_featured: true,
    is_popular: true,
    sort_order: 12,
  }),

  // Smart locks
  createDemoProduct({
    id: "demo-product-13",
    slug: "smart-door-lock",
    category_id: CATEGORY_IDS.smartLocks,
    name_ar: "قفل باب ذكي",
    description_ar:
      "خيار للتحكم في الدخول. تُضاف طرق الفتح وأنواع الأبواب المتوافقة ومتطلبات التركيب لاحقًا.",
    sku: "DEMO-013",
    price: null,
    imageSrc: "/images/categories/4.png",
    is_featured: true,
    is_popular: true,
    sort_order: 13,
  }),

  // Sound systems
  createDemoProduct({
    id: "demo-product-14",
    slug: "indoor-ceiling-speaker",
    category_id: CATEGORY_IDS.soundSystems,
    name_ar: "سماعة سقفية داخلية",
    description_ar:
      "سماعة للمساحات الداخلية. تُضاف القدرة والمقاس ومتطلبات التوصيل لاحقًا.",
    sku: "DEMO-014",
    price: 1250,
    imageSrc: "/images/categories/5.png",
    is_featured: true,
    is_popular: false,
    sort_order: 14,
  }),

  createDemoProduct({
    id: "demo-product-15",
    slug: "home-audio-amplifier",
    category_id: CATEGORY_IDS.soundSystems,
    name_ar: "مضخم صوت منزلي",
    description_ar:
      "وحدة لتشغيل نظام صوتي داخلي. تُضاف القدرة وعدد القنوات والتوافق مع السماعات لاحقًا.",
    sku: "DEMO-015",
    price: null,
    imageSrc: "/images/categories/electric.jpg",
    is_featured: false,
    is_popular: false,
    sort_order: 15,
  }),

  createDemoProduct({
    id: "demo-product-16",
    slug: "adjustable-recessed-spotlight",
    category_id: CATEGORY_IDS.spotlights,
    name_ar: "اسبوت غاطس قابل للتوجيه",
    description_ar: "تُضاف مواصفات المنتج الفعلية بعد تأكيدها.",
    sku: "DEMO-016",
    price: 240,
    imageSrc: "/images/categories/1.png",
    is_featured: false,
    is_popular: true,
    sort_order: 16,
  }),
];
