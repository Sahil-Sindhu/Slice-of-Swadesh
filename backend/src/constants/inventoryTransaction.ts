export const INVENTORY_TRANSACTION_TYPES = [
    "ADD",
    "REMOVE",
    "ADJUST",
    "WASTE",
    "ORDER"
] as const;

export type InventoryTransactionType = typeof INVENTORY_TRANSACTION_TYPES[number];
