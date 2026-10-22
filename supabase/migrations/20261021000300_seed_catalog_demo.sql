begin;

-- =========================================================
-- 1. Main categories
-- =========================================================

insert into public.categories (
  id,
  name_ar,
  name_en,
  slug,
  description_ar,
  image_path,
  parent_id,
  sort_order
)
values
(
  'a1000000-0000-4000-8000-000000000001',
  'الإضاءة',
  'Lighting',
  'lighting',
  'من النجف إلى الإضاءة الداخلية والخارجية، خيارات متنوعة تكمل جمال كل مساحة.',
  '/images/categories/1.png',
  null,
  1
),
(
  'a1000000-0000-4000-8000-000000000002',
  'المفاتيح والتشطيبات الكهربائية',
  'Switches & Electrical',
  'electrical',
  'مفاتيح وبرايز وإكسسوارات كهربائية تجمع بين الاستخدام العملي وأناقة التصميم.',
  '/images/categories/2.png',
  null,
  2
),
(
  'a1000000-0000-4000-8000-000000000003',
  'الأنظمة الذكية',
  'Smart Home',
  'smart-home',
  'خيارات للتحكم في الإضاءة والأجهزة لتجربة منزلية أكثر راحة وسهولة.',
  '/images/categories/3.png',
  null,
  3
),
(
  'a1000000-0000-4000-8000-000000000004',
  'الأقفال الذكية',
  'Smart Locks',
  'smart-locks',
  'حلول للتحكم في الدخول تجمع بين الأمان وسهولة الاستخدام.',
  '/images/categories/4.png',
  null,
  4
),
(
  'a1000000-0000-4000-8000-000000000005',
  'الأنظمة الصوتية',
  'Sound Systems',
  'sound-systems',
  'سماعات وحلول صوتية للمنازل والمساحات التجارية.',
  '/images/categories/5.png',
  null,
  5
);

-- =========================================================
-- 2. Lighting and electrical subcategories
-- =========================================================

insert into public.categories (
  id,
  name_ar,
  name_en,
  slug,
  description_ar,
  image_path,
  parent_id,
  sort_order
)
values
(
  'a1000000-0000-4000-8000-000000000101',
  'النجف',
  'Chandeliers',
  'chandeliers',
  'نجف مودرن وكلاسيك للمساحات الداخلية.',
  '/images/categories/1.png',
  'a1000000-0000-4000-8000-000000000001',
  1
),
(
  'a1000000-0000-4000-8000-000000000103',
  'الإضاءة الداخلية',
  'Indoor Lighting',
  'indoor-lighting',
  'اسبوتات وليد وأباليك ووحدات سقف للمساحات الداخلية.',
  '/images/categories/1.png',
  'a1000000-0000-4000-8000-000000000001',
  2
),
(
  'a1000000-0000-4000-8000-000000000102',
  'الإضاءة الخارجية',
  'Outdoor Lighting',
  'outdoor-lighting',
  'وحدات إضاءة للجدران والممرات والمساحات الخارجية.',
  '/images/categories/1.png',
  'a1000000-0000-4000-8000-000000000001',
  3
),
(
  'a1000000-0000-4000-8000-000000000201',
  'المفاتيح',
  'Switches',
  'switches',
  'مفاتيح كهربائية بتصميمات متنوعة.',
  '/images/categories/2.png',
  'a1000000-0000-4000-8000-000000000002',
  1
),
(
  'a1000000-0000-4000-8000-000000000202',
  'البرايز',
  'Sockets',
  'sockets',
  'برايز ومخارج كهربائية لاستخدامات مختلفة.',
  '/images/categories/2.png',
  'a1000000-0000-4000-8000-000000000002',
  2
),
(
  'a1000000-0000-4000-8000-000000000203',
  'الإكسسوارات الكهربائية',
  'Electrical Accessories',
  'electrical-accessories',
  'إطارات وملحقات لتكملة التشطيبات الكهربائية.',
  '/images/categories/2.png',
  'a1000000-0000-4000-8000-000000000002',
  3
);

-- =========================================================
-- 3. Indoor lighting types
-- =========================================================

insert into public.categories (
  id,
  name_ar,
  name_en,
  slug,
  description_ar,
  image_path,
  parent_id,
  sort_order
)
values
(
  'a1000000-0000-4000-8000-000000000111',
  'الاسبوتات',
  'Spotlights',
  'spotlights',
  'وحدات إضاءة مركزة للمساحات الداخلية.',
  '/images/categories/1.png',
  'a1000000-0000-4000-8000-000000000103',
  1
),
(
  'a1000000-0000-4000-8000-000000000112',
  'إضاءة الليد',
  'LED Lighting',
  'led-lighting',
  'خيارات ليد للإضاءة المخفية والتفاصيل الديكورية.',
  '/images/categories/1.png',
  'a1000000-0000-4000-8000-000000000103',
  2
),
(
  'a1000000-0000-4000-8000-000000000113',
  'الأباليك',
  'Wall Lights',
  'wall-lights',
  'وحدات إضاءة جدارية داخلية.',
  '/images/categories/1.png',
  'a1000000-0000-4000-8000-000000000103',
  3
),
(
  'a1000000-0000-4000-8000-000000000114',
  'وحدات السقف',
  'Ceiling Lights',
  'ceiling-lights',
  'وحدات سقفية للغرف والممرات.',
  '/images/categories/1.png',
  'a1000000-0000-4000-8000-000000000103',
  4
);

-- =========================================================
-- 4. Temporary input table
-- Used only during this transaction, then removed.
-- =========================================================

create temporary table catalog_demo_input (
  sequence_number integer primary key,
  slug text not null,
  category_slug text not null,
  name_ar text not null,
  description_ar text not null,
  price numeric(12, 2),
  image_src text not null,
  is_featured boolean not null,
  is_popular boolean not null
) on commit drop;

insert into catalog_demo_input
values
(
  1,
  'modern-ring-chandelier',
  'chandeliers',
  'نجفة حلقات مودرن',
  'تصميم بحلقات معلّقة لغرف المعيشة والاستقبال.',
  2450,
  '/images/categories/lighting.jpg',
  true,
  true
),
(
  2,
  'classic-crystal-chandelier',
  'chandeliers',
  'نجفة كريستال كلاسيك',
  'وحدة إضاءة بطابع كلاسيكي للمساحات الداخلية.',
  5200,
  '/images/categories/1.png',
  true,
  true
),
(
  3,
  'recessed-ceiling-spotlight',
  'spotlights',
  'اسبوت سقفي غاطس',
  'إضاءة مركزة للأسقف الداخلية.',
  185,
  '/images/categories/lighting.jpg',
  false,
  true
),
(
  4,
  'concealed-led-strip',
  'led-lighting',
  'شريط ليد للإضاءة المخفية',
  'خيار للإضاءة الديكورية داخل التجاويف.',
  null,
  '/images/categories/1.png',
  false,
  false
),
(
  5,
  'modern-indoor-wall-light',
  'wall-lights',
  'أبليك داخلي مودرن',
  'وحدة جدارية للممرات وغرف المعيشة.',
  780,
  '/images/categories/lighting.jpg',
  true,
  false
),
(
  6,
  'round-ceiling-light',
  'ceiling-lights',
  'وحدة سقف دائرية',
  'تصميم سقفي بسيط للغرف والمساحات الداخلية.',
  1150,
  '/images/categories/1.png',
  false,
  true
),
(
  7,
  'outdoor-wall-light',
  'outdoor-lighting',
  'وحدة إضاءة جدارية خارجية',
  'وحدة لإضاءة الجدران الخارجية.',
  950,
  '/images/categories/lighting.jpg',
  true,
  true
),
(
  8,
  'garden-path-light',
  'outdoor-lighting',
  'وحدة إضاءة للممرات والحدائق',
  'تصميم لإضاءة المسارات الخارجية.',
  null,
  '/images/categories/1.png',
  false,
  false
),
(
  9,
  'modern-double-switch',
  'switches',
  'مفتاح كهربائي مزدوج',
  'مفتاح بتصميم عصري للتشطيبات الداخلية.',
  350,
  '/images/categories/electric.jpg',
  true,
  true
),
(
  10,
  'wall-power-socket',
  'sockets',
  'بريزة كهربائية جدارية',
  'مخرج كهربائي للمساحات الداخلية.',
  290,
  '/images/categories/2.png',
  false,
  false
),
(
  11,
  'electrical-switch-frame',
  'electrical-accessories',
  'إطار تشطيب للمفاتيح والبرايز',
  'إطار لتكملة مظهر الوحدات الكهربائية.',
  120,
  '/images/categories/electric.jpg',
  false,
  false
),
(
  12,
  'smart-lighting-control-panel',
  'smart-home',
  'لوحة تحكم بالإضاءة الذكية',
  'واجهة للتحكم بالإضاءة المنزلية.',
  1850,
  '/images/categories/3.png',
  true,
  true
),
(
  13,
  'smart-door-lock',
  'smart-locks',
  'قفل باب ذكي',
  'خيار للتحكم في الدخول إلى المنزل.',
  null,
  '/images/categories/4.png',
  true,
  true
),
(
  14,
  'indoor-ceiling-speaker',
  'sound-systems',
  'سماعة سقفية داخلية',
  'سماعة للمساحات الداخلية.',
  1250,
  '/images/categories/5.png',
  true,
  false
),
(
  15,
  'home-audio-amplifier',
  'sound-systems',
  'مضخم صوت منزلي',
  'وحدة لتشغيل نظام صوتي داخلي.',
  null,
  '/images/categories/electric.jpg',
  false,
  false
);

-- Ensure that every referenced category exists.
do $$
begin
  if exists (
    select 1
    from catalog_demo_input as input
    left join public.categories as category
      on category.slug = input.category_slug
    where category.id is null
  ) then
    raise exception 'A demo product references a missing category.';
  end if;
end;
$$;

-- =========================================================
-- 5. Products with stable UUIDs
-- =========================================================

insert into public.products (
  id,
  category_id,
  slug,
  name_ar,
  description_ar,
  sku,
  price,
  is_active,
  is_featured,
  is_popular,
  sort_order
)
select
  (
    'b1000000-0000-4000-8000-'
    || lpad(input.sequence_number::text, 12, '0')
  )::uuid,

  category.id,
  input.slug,
  input.name_ar,

  'نموذج تجريبي: '
    || input.description_ar
    || ' تُضاف المواصفات الفعلية لاحقًا.',

  'DEMO-' || lpad(input.sequence_number::text, 3, '0'),

  input.price,
  true,
  input.is_featured,
  input.is_popular,
  input.sequence_number

from catalog_demo_input as input
join public.categories as category
  on category.slug = input.category_slug;

-- =========================================================
-- 6. One temporary image per demo product
-- =========================================================

insert into public.product_images (
  product_id,
  src,
  alt,
  sort_order
)
select
  product.id,
  input.image_src,
  'صورة توضيحية مؤقتة للمنتج: ' || input.name_ar,
  0
from catalog_demo_input as input
join public.products as product
  on product.slug = input.slug;

commit;