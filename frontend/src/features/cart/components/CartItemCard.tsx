import * as React from 'react';
import type { ApiCartItem } from '../types/cart.types';
import { Utensils, Trash2, Plus, Minus } from 'lucide-react';

export interface CartItemCardProps {
  item: ApiCartItem;
  onQuantityChange: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
  isUpdating: boolean;
}

export function CartItemCard({ item, onQuantityChange, onRemove, isUpdating }: CartItemCardProps) {
  return (
    <div
      className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl border border-[#F0E6D8] bg-white hover:border-[#E8441A]/25 hover:shadow-[0_4px_20px_-4px_rgba(26,18,8,0.06)] transition-all group"
      style={{ opacity: isUpdating ? 0.6 : 1, transition: 'opacity 0.2s' }}
    >
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[#FFF5E9] border border-[#F0E6D8] flex items-center justify-center text-[#B5957D] shrink-0 group-hover:scale-105 transition-transform">
        <Utensils size={24} strokeWidth={1.5} />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-[#1A1208] text-sm truncate">{item.foodName}</h3>
        <p className="text-xs text-[#8C6E5A] mt-0.5">{item.variantName}</p>
        <p className="text-sm font-black text-[#E8441A] mt-1">₹{item.unitPrice} <span className="text-[#B5957D] font-normal text-xs">each</span></p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center border-2 border-[#F0E6D8] rounded-xl overflow-hidden">
          <button
            onClick={() => onQuantityChange(item._id, item.quantity - 1)}
            disabled={isUpdating || item.quantity <= 1}
            aria-label={`Decrease quantity of ${item.foodName}`}
            className="w-9 h-9 flex items-center justify-center text-[#E8441A] hover:bg-[#FFF0EB] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Minus size={14} strokeWidth={3} />
          </button>
          <span className="w-8 text-center font-bold text-[#1A1208] text-sm">{item.quantity}</span>
          <button
            onClick={() => onQuantityChange(item._id, item.quantity + 1)}
            disabled={isUpdating || item.quantity >= 20}
            aria-label={`Increase quantity of ${item.foodName}`}
            className="w-9 h-9 flex items-center justify-center text-[#E8441A] hover:bg-[#FFF0EB] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus size={14} strokeWidth={3} />
          </button>
        </div>

        <button
          onClick={() => onRemove(item._id)}
          disabled={isUpdating}
          className="p-2 text-[#8C6E5A] hover:text-[#DC2626] hover:bg-[#FEF2F2] rounded-xl transition-all cursor-pointer disabled:opacity-40"
          aria-label="Remove item"
        >
          <Trash2 size={16} />
        </button>

        <span className="text-sm font-black text-[#1A1208] w-16 text-right">₹{item.totalPrice}</span>
      </div>
    </div>
  );
}

