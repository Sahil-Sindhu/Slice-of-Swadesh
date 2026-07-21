export const INVENTORY_UNITS = [
    "g",
    "kg",
    "ml",
    "l",
    "pcs"
] as const;

export type InventoryUnit = typeof INVENTORY_UNITS[number];
