import type { OrderStatus } from "@/lib/orders/status";

export type TrackedOrder = {
  orderNumber: string;
  status: OrderStatus;
  fulfillmentMethod: "pickup" | "delivery";
  createdAt: string;
  updatedAt: string;
};

export type OrderTrackingState = {
  error: string | null;
  order: TrackedOrder | null;
};
