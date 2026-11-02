export const orderStatuses = {
  new: "طلب جديد",
  confirmed: "تم التأكيد",
  preparing: "قيد التجهيز",
  ready_for_pickup: "جاهز للاستلام",
  out_for_delivery: "خرج للتوصيل",
  completed: "مكتمل",
  cancelled: "ملغي",
} as const;

export type OrderStatus = keyof typeof orderStatuses;

export function isOrderStatus(value: string): value is OrderStatus {
  return Object.prototype.hasOwnProperty.call(orderStatuses, value);
}

export function getOrderStatusLabel(value: string): string {
  return isOrderStatus(value) ? orderStatuses[value] : "حالة غير معروفة";
}

export function getNextOrderStatuses(
  status: string,
  fulfillmentMethod: string,
): OrderStatus[] {
  switch (status) {
    case "new":
      return ["confirmed", "cancelled"];

    case "confirmed":
      return ["preparing", "cancelled"];

    case "preparing":
      return [
        fulfillmentMethod === "delivery"
          ? "out_for_delivery"
          : "ready_for_pickup",
        "cancelled",
      ];

    case "ready_for_pickup":
    case "out_for_delivery":
      return ["completed", "cancelled"];

    default:
      return [];
  }
}
