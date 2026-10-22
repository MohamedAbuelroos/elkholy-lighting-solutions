import "server-only";

import sharp, { type Metadata } from "sharp";

import { CATALOG_IMAGE_CONFIG } from "@/lib/images/catalog-image-config";

export async function optimizeCatalogImage(file: File): Promise<Buffer> {
  const { maxBytes, targetBytes, maxDimension } = CATALOG_IMAGE_CONFIG;

  if (file.size === 0) {
    throw new Error("الصورة فارغة. اختر صورة أخرى.");
  }

  if (file.size > maxBytes) {
    throw new Error(
      "الصورة تجاوزت الحجم المسموح بعد الضغط. أعد اختيارها وحاول مرة أخرى.",
    );
  }

  if (file.type !== "image/webp") {
    throw new Error("يجب تحويل الصورة إلى WebP قبل رفعها.");
  }

  const input = Buffer.from(await file.arrayBuffer());

  const options = {
    limitInputPixels: maxDimension * maxDimension,
    failOn: "error" as const,
  };

  let metadata: Metadata;

  try {
    metadata = await sharp(input, options).metadata();
  } catch {
    throw new Error("تعذّر قراءة الصورة. اختر ملف صورة صالحًا.");
  }

  // التحقق من محتوى الملف نفسه، وليس اسمه أو نوعه المعلن فقط.
  if (metadata.format !== "webp" || !metadata.width || !metadata.height) {
    throw new Error("محتوى الملف ليس صورة WebP صالحة.");
  }

  if ((metadata.pages ?? 1) > 1) {
    throw new Error("الصور المتحركة غير مدعومة لصور المنتجات.");
  }

  if (metadata.width > maxDimension || metadata.height > maxDimension) {
    throw new Error("أبعاد الصورة تجاوزت الحد المسموح بعد المعالجة.");
  }

  let fallback: Buffer | null = null;

  for (const quality of [82, 72, 62]) {
    let output: Buffer;

    try {
      output = await sharp(input, options)
        .rotate()
        .resize({
          width: maxDimension,
          height: maxDimension,
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({
          quality,
          effort: 4,
        })
        .toBuffer();
    } catch {
      throw new Error("تعذّرت معالجة الصورة. اختر صورة أخرى.");
    }

    if (output.length <= targetBytes) {
      return output;
    }

    // الاحتفاظ بأعلى جودة ضمن الحد النهائي.
    if (!fallback && output.length <= maxBytes) {
      fallback = output;
    }
  }

  if (fallback) {
    return fallback;
  }

  throw new Error(
    "تعذّر تقليل حجم الصورة للحد المسموح. اختر صورة أبسط أو أصغر.",
  );
}
