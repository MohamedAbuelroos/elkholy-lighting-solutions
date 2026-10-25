import type { Testimonial } from "@/types/testimonial";

export const testimonialsConfig = {
  isDemo: true,
};

export const testimonials = [
  {
    id: "demo-review-01",
    name: "عميل تجريبي 01",
    context: "اختيار إضاءة منزلية",
    quote:
      "نص تجريبي لمعاينة التصميم: ساعدني وضوح الخيارات وشرح الفروق بين وحدات الإضاءة في تحديد ما يناسب مساحتي.",
    is_active: true,
    sort_order: 1,
  },
  {
    id: "demo-review-02",
    name: "عميل تجريبي 02",
    context: "تشطيبات كهربائية",
    quote:
      "نص تجريبي لمعاينة التصميم: كنت أبحث عن مفاتيح تتناسب مع الديكور، وكان تنوع التصميمات مفيدًا في الاختيار.",
    is_active: true,
    sort_order: 2,
  },
  {
    id: "demo-review-03",
    name: "عميل تجريبي 03",
    context: "حلول منزل ذكي",
    quote:
      "نص تجريبي لمعاينة التصميم: شرح الاستخدام والتوافق مع احتياجات المنزل جعل المقارنة بين الحلول أسهل.",
    is_active: true,
    sort_order: 3,
  },
  {
    id: "demo-review-04",
    name: "عميل تجريبي 04",
    context: "إضاءة مساحة تجارية",
    quote:
      "نص تجريبي لمعاينة التصميم: ساعدتني معرفة المواصفات على اختيار إضاءة تتناسب مع طبيعة المكان.",
    is_active: true,
    sort_order: 4,
  },
  {
    id: "demo-review-05",
    name: "عميل تجريبي 05",
    context: "اختيار وحدات معلّقة",
    quote:
      "نص تجريبي لمعاينة التصميم: وجدت خيارات متنوعة، واستطعت مقارنة المقاسات والتصميمات قبل تحديد اختياري.",
    is_active: true,
    sort_order: 5,
  },
] satisfies Testimonial[];
