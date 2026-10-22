import { CATALOG_IMAGE_CONFIG } from "@/lib/images/catalog-image-config";

function canvasToWebP(
  canvas: HTMLCanvasElement,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob || blob.type !== "image/webp") {
          reject(
            new Error(
              "المتصفح لم يتمكن من تحويل الصورة إلى WebP. جرّب متصفحًا أحدث.",
            ),
          );

          return;
        }

        resolve(blob);
      },
      "image/webp",
      quality,
    );
  });
}

export async function prepareCatalogImage(file: File): Promise<File> {
  const { maxOriginalBytes, maxDimension, maxBytes, targetBytes } =
    CATALOG_IMAGE_CONFIG;

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];

  if (!allowedTypes.includes(file.type)) {
    throw new Error("اختر صورة بصيغة JPG أو PNG أو WebP أو AVIF.");
  }

  if (file.size === 0) {
    throw new Error("الصورة فارغة. اختر صورة أخرى.");
  }

  if (file.size > maxOriginalBytes) {
    throw new Error("الصورة الأصلية أكبر من 20 ميجابايت.");
  }

  let bitmap: ImageBitmap;

  try {
    bitmap = await createImageBitmap(file, {
      imageOrientation: "from-image",
    });
  } catch {
    throw new Error("تعذّر فتح الصورة. جرّب صورة أخرى.");
  }

  try {
    if (
      bitmap.width <= 0 ||
      bitmap.height <= 0 ||
      bitmap.width * bitmap.height > 40_000_000
    ) {
      throw new Error("أبعاد الصورة الأصلية كبيرة جدًا. اختر نسخة أصغر.");
    }

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("المتصفح لا يدعم معالجة الصور.");
    }

    let fallback: Blob | null = null;

    for (const factor of [1, 0.8, 0.64]) {
      const dimension = Math.round(maxDimension * factor);

      const scale = Math.min(
        1,
        dimension / bitmap.width,
        dimension / bitmap.height,
      );

      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));

      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

      for (const quality of [0.82, 0.72, 0.62]) {
        const blob = await canvasToWebP(canvas, quality);

        if (blob.size <= targetBytes) {
          return new File([blob], "product-image.webp", {
            type: "image/webp",
          });
        }

        if (!fallback && blob.size <= maxBytes) {
          fallback = blob;
        }
      }
    }

    if (fallback) {
      return new File([fallback], "product-image.webp", {
        type: "image/webp",
      });
    }

    throw new Error("تعذّر ضغط الصورة للحجم المطلوب. اختر صورة أصغر.");
  } finally {
    bitmap.close();
  }
}
