import type { Testimonial } from "@/types/testimonial";

export const testimonialsConfig = {
  isDemo: false,
  rating: 3.8,
  reviewCount: 11,
  updatedAtLabel: "6 نوفمبر 2026",
  mapsUrl: "https://maps.app.goo.gl/MikNui1prUNc8twx8",

  // Replace with Google's direct review-request link when available.
  writeReviewUrl: "https://maps.app.goo.gl/MikNui1prUNc8twx8",
};

export const testimonials = [
  {
    id: "google-review-aa-01",
    name: "A Al",
    context: "مراجعة منشورة على Google",
    quote:
      "المحترم المهندس إبراهيم الخولي شكرا علي تعاملك الراقي\nانصح بتعامل معه جودة ممتازة",
    rating: 5,
    is_active: true,
    sort_order: 1,
  },

  // Design examples only. Keep inactive until replaced with real feedback.
  {
    id: "google-review-aa-02",
    name: "Akram Melad",
    context: "مراجعة منشورة على Google",
    quote: "بجد انا اول مره اشوف عرض وموديلات تخطف نظري مكان جميل فعل.",
    rating: 5,
    is_active: true,
    sort_order: 2,
  },
  {
    id: "google-review-aa-03",
    name: "منير فايز",
    context: "مراجعة منشورة على Google",
    quote: "اسعار و مواصفات ممتازة.",
    rating: 5,
    is_active: true,
    sort_order: 3,
  },
  {
    id: "google-review-aa-04",
    name: "منير فايز",
    context: "مراجعة منشورة على Google",
    quote: "معاملات متميزه وموديلات وعروض أفضل.",
    rating: 5,
    is_active: true,
    sort_order: 3,
  },
] satisfies Testimonial[];
