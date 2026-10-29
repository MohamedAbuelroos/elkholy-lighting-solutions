import { company } from "@/data/company";
import { routes, getProductPath } from "@/config/routes";
import { siteConfig } from "@/config/site";

export type ProductInquiry = {
  name: string;
  slug: string;
  sku: string | null;
  sale_price: number | null;
};

export function buildWhatsAppUrl(
  phone: string,
  message: string = siteConfig.defaultWhatsAppMessage,
): string {
  const normalizedPhone = phone.replace(/[\s()+.-]/g, "");

  if (!/^[1-9]\d{7,14}$/.test(normalizedPhone)) {
    throw new Error("WhatsApp requires a valid international phone number.");
  }

  const url = new URL(`https://wa.me/${normalizedPhone}`);
  url.searchParams.set("text", message);

  return url.toString();
}

export function getPrimaryWhatsAppHref(): string {
  const contact = company.whatsapp.find((item) => item.name === company.name);

  // Keep a useful contact destination if the official entry is unavailable.
  if (!contact) {
    return routes.links;
  }

  return buildWhatsAppUrl(contact.number);
}

export function buildProductWhatsAppUrl(
  phone: string,
  product: ProductInquiry,
): string {
  const productUrl = new URL(
    getProductPath(product.slug),
    siteConfig.url,
  ).toString();

  const formattedPrice =
    product.sale_price === null
      ? null
      : new Intl.NumberFormat("ar-EG", {
          style: "currency",
          currency: siteConfig.currency,
          maximumFractionDigits: 2,
        }).format(product.sale_price);

  const message = [
    "مرحبًا، أريد الاستفسار عن المنتج:",
    "",
    `المنتج: ${product.name}`,
    product.sku ? `الكود: ${product.sku}` : null,
    formattedPrice ? `السعر المعروض: ${formattedPrice}` : null,
    "",
    "رابط المنتج:",
    productUrl,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  return buildWhatsAppUrl(phone, message);
}
