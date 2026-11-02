export type CustomerReceiptItem = {
  id: string;
  product_name: string;
  product_sku: string | null;
  quantity: number;
  original_unit_price: number | null;
  discount_percent: number;
  unit_price: number | null;
  line_total: number | null;
};

export type CustomerReceipt = {
  orderNumber: string;
  createdAt: string;
  statusLabel: string;
  customerName: string;
  customerPhone: string;
  fulfillmentMethod: "pickup" | "delivery";
  governorate: string | null;
  city: string | null;
  address: string | null;
  customerNotes: string | null;
  items: CustomerReceiptItem[];
};

export type CustomerReceiptResult =
  | { receipt: CustomerReceipt; error: null }
  | { receipt: null; error: string };
