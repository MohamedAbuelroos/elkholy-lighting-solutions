export type OrderReceipt = {
  orderId: string;
  orderNumber: string;
  trackingCode: string;
  createdAt: string;
};

export type OrderFormState = {
  error: string | null;
  receipt: OrderReceipt | null;
  outcome: "idle" | "editable-error" | "uncertain" | "not-found" | "challenge-error" | "success";
};
