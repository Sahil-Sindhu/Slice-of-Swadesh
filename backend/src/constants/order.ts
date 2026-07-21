export const ORDER_STATUS = [
    "Pending",
    "Confirmed",
    "Preparing",
    "Ready",
    "Completed",
    "Cancelled"
] as const;

export type OrderStatus = typeof ORDER_STATUS[number];

export const PAYMENT_STATUS = [
    "Pending",
    "Paid",
    "Failed",
    "Refunded"
] as const;

export type PaymentStatus = typeof PAYMENT_STATUS[number];

export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
    Pending: ["Confirmed", "Cancelled"],
    Confirmed: ["Preparing", "Cancelled"],
    Preparing: ["Ready"],
    Ready: ["Completed"],
    Completed: [],
    Cancelled: []
};
