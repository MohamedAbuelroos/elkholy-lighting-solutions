import type { Category } from "@/types/category";

export const CATEGORY_IDS = {
  lighting: "a1000000-0000-4000-8000-000000000001",
  electrical: "a1000000-0000-4000-8000-000000000002",
  smartHome: "a1000000-0000-4000-8000-000000000003",
  smartLocks: "a1000000-0000-4000-8000-000000000004",
  soundSystems: "a1000000-0000-4000-8000-000000000005",

  chandeliers: "a1000000-0000-4000-8000-000000000101",
  outdoorLighting: "a1000000-0000-4000-8000-000000000102",
  indoorLighting: "a1000000-0000-4000-8000-000000000103",

  spotlights: "a1000000-0000-4000-8000-000000000111",
  ledLighting: "a1000000-0000-4000-8000-000000000112",
  wallLights: "a1000000-0000-4000-8000-000000000113",
  ceilingLights: "a1000000-0000-4000-8000-000000000114",

  switches: "a1000000-0000-4000-8000-000000000201",
  sockets: "a1000000-0000-4000-8000-000000000202",
  electricalAccessories: "a1000000-0000-4000-8000-000000000203",
} as const;

type CategoryInput = Pick<
  Category,
  | "id"
  | "name_ar"
  | "name_en"
  | "slug"
  | "description_ar"
  | "image_path"
  | "parent_id"
  | "sort_order"
>;

function createCategory(input: CategoryInput): Category {
  return {
    ...input,
    description_en: null,
    is_active: true,
  };
}

export const categories: Category[] = [
  // Main categories
  createCategory({
    id: CATEGORY_IDS.lighting,
    name_ar: "الإضاءة",
    name_en: "Lighting",
    slug: "lighting",
    description_ar:
      "من النجف إلى الإضاءة الداخلية والخارجية، خيارات متنوعة تكمل جمال كل مساحة.",
    image_path: "/images/categories/1.png",
    parent_id: null,
    sort_order: 1,
  }),

  createCategory({
    id: CATEGORY_IDS.electrical,
    name_ar: "المفاتيح والتشطيبات الكهربائية",
    name_en: "Switches & Electrical",
    slug: "electrical",
    description_ar:
      "مفاتيح وبرايز وإكسسوارات كهربائية تجمع بين الاستخدام العملي وأناقة التصميم.",
    image_path: "/images/categories/2.png",
    parent_id: null,
    sort_order: 2,
  }),

  createCategory({
    id: CATEGORY_IDS.smartHome,
    name_ar: "الأنظمة الذكية",
    name_en: "Smart Home",
    slug: "smart-home",
    description_ar:
      "خيارات للتحكم في الإضاءة والأجهزة لتجربة منزلية أكثر راحة وسهولة.",
    image_path: "/images/categories/3.png",
    parent_id: null,
    sort_order: 3,
  }),

  createCategory({
    id: CATEGORY_IDS.smartLocks,
    name_ar: "الأقفال الذكية",
    name_en: "Smart Locks",
    slug: "smart-locks",
    description_ar: "حلول للتحكم في الدخول تجمع بين الأمان وسهولة الاستخدام.",
    image_path: "/images/categories/4.png",
    parent_id: null,
    sort_order: 4,
  }),

  createCategory({
    id: CATEGORY_IDS.soundSystems,
    name_ar: "الأنظمة الصوتية",
    name_en: "Sound Systems",
    slug: "sound-systems",
    description_ar: "سماعات وحلول صوتية للمنازل والمساحات التجارية.",
    image_path: "/images/categories/5.png",
    parent_id: null,
    sort_order: 5,
  }),

  // Lighting subcategories
  createCategory({
    id: CATEGORY_IDS.chandeliers,
    name_ar: "النجف",
    name_en: "Chandeliers",
    slug: "chandeliers",
    description_ar: "نجف مودرن وكلاسيك لإضاءة المساحات الداخلية.",
    image_path: "/images/categories/1.png",
    parent_id: CATEGORY_IDS.lighting,
    sort_order: 1,
  }),

  createCategory({
    id: CATEGORY_IDS.indoorLighting,
    name_ar: "الإضاءة الداخلية",
    name_en: "Indoor Lighting",
    slug: "indoor-lighting",
    description_ar:
      "اسبوتات وليد وأباليك ووحدات سقف تناسب احتياجات الإضاءة الداخلية.",
    image_path: "/images/categories/1.png",
    parent_id: CATEGORY_IDS.lighting,
    sort_order: 2,
  }),

  createCategory({
    id: CATEGORY_IDS.outdoorLighting,
    name_ar: "الإضاءة الخارجية",
    name_en: "Outdoor Lighting",
    slug: "outdoor-lighting",
    description_ar: "وحدات إضاءة للجدران والممرات والمساحات الخارجية.",
    image_path: "/images/categories/1.png",
    parent_id: CATEGORY_IDS.lighting,
    sort_order: 3,
  }),

  // Indoor lighting types
  createCategory({
    id: CATEGORY_IDS.spotlights,
    name_ar: "الاسبوتات",
    name_en: "Spotlights",
    slug: "spotlights",
    description_ar: "وحدات إضاءة مركزة لإبراز تفاصيل المساحات الداخلية.",
    image_path: "/images/categories/1.png",
    parent_id: CATEGORY_IDS.indoorLighting,
    sort_order: 1,
  }),

  createCategory({
    id: CATEGORY_IDS.ledLighting,
    name_ar: "إضاءة الليد",
    name_en: "LED Lighting",
    slug: "led-lighting",
    description_ar: "خيارات إضاءة ليد للإضاءة المخفية والتفاصيل الديكورية.",
    image_path: "/images/categories/1.png",
    parent_id: CATEGORY_IDS.indoorLighting,
    sort_order: 2,
  }),

  createCategory({
    id: CATEGORY_IDS.wallLights,
    name_ar: "الأباليك",
    name_en: "Wall Lights",
    slug: "wall-lights",
    description_ar: "أباليك داخلية تضيف طبقة إضاءة ولمسة ديكورية للجدران.",
    image_path: "/images/categories/1.png",
    parent_id: CATEGORY_IDS.indoorLighting,
    sort_order: 3,
  }),

  createCategory({
    id: CATEGORY_IDS.ceilingLights,
    name_ar: "وحدات السقف",
    name_en: "Ceiling Lights",
    slug: "ceiling-lights",
    description_ar: "وحدات إنارة سقفية للغرف والممرات والمساحات الداخلية.",
    image_path: "/images/categories/1.png",
    parent_id: CATEGORY_IDS.indoorLighting,
    sort_order: 4,
  }),

  // Electrical subcategories
  createCategory({
    id: CATEGORY_IDS.switches,
    name_ar: "المفاتيح",
    name_en: "Switches",
    slug: "switches",
    description_ar: "مفاتيح كهربائية بتصميمات تتناسب مع طابع المكان.",
    image_path: "/images/categories/2.png",
    parent_id: CATEGORY_IDS.electrical,
    sort_order: 1,
  }),

  createCategory({
    id: CATEGORY_IDS.sockets,
    name_ar: "البرايز",
    name_en: "Sockets",
    slug: "sockets",
    description_ar: "برايز ومخارج كهربائية لاستخدامات المساحات المختلفة.",
    image_path: "/images/categories/2.png",
    parent_id: CATEGORY_IDS.electrical,
    sort_order: 2,
  }),

  createCategory({
    id: CATEGORY_IDS.electricalAccessories,
    name_ar: "الإكسسوارات الكهربائية",
    name_en: "Electrical Accessories",
    slug: "electrical-accessories",
    description_ar: "إطارات وملحقات لتكملة التشطيبات الكهربائية.",
    image_path: "/images/categories/2.png",
    parent_id: CATEGORY_IDS.electrical,
    sort_order: 3,
  }),
];
