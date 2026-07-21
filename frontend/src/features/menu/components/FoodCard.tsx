'use client';

import * as React from 'react';
import Link from 'next/link';
import { Heart, Star, Clock, Plus, Check, Flame, Utensils } from 'lucide-react';
import type { ApiFood } from '../types/menu.types';

interface FoodCardProps {
  food: ApiFood;
  onAddToCart?: (food: ApiFood) => void;
}

// ─── Veg/Food Type badge config ────────────────────────────────────────────────
const FOOD_TYPE_CONFIG: Record<string, { label: string; dot: string; border: string; text: string }> = {
  Veg:    { label: 'VEG',     dot: 'bg-[#16A34A]', border: 'border-[#16A34A]', text: 'text-[#15803D]' },
  Vegan:  { label: 'VEGAN',   dot: 'bg-[#16A34A]', border: 'border-[#16A34A]', text: 'text-[#15803D]' },
  NonVeg: { label: 'NON VEG', dot: 'bg-[#DC2626]', border: 'border-[#DC2626]', text: 'text-[#B91C1C]' },
  Jain:   { label: 'JAIN',    dot: 'bg-[#F59E0B]', border: 'border-[#F59E0B]', text: 'text-[#B45309]' },
  Egg:    { label: 'EGG',     dot: 'bg-[#F59E0B]', border: 'border-[#F59E0B]', text: 'text-[#B45309]' },
};

export function FoodCard({ food, onAddToCart }: FoodCardProps) {
  const [liked, setLiked] = React.useState(false);
  const [added, setAdded] = React.useState(false);

  const typeConfig = FOOD_TYPE_CONFIG[food.foodType] ?? FOOD_TYPE_CONFIG.Veg;
  const displayPrice = food.variants.length > 0 ? food.variants[0].price : food.basePrice;
  const imageUrl = food.images[0]?.url;
  const isAvailable = food.isAvailable;

  const handleAddToCart = () => {
    if (!isAvailable) return;
    onAddToCart?.(food);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-[0_4px_20px_-4px_rgba(26,18,8,0.06)] hover:shadow-[0_12px_32px_-8px_rgba(26,18,8,0.10)] transition-all duration-[250ms] hover:-translate-y-1.5 border border-[#F0E6D8] flex flex-col">
      {/* ── Image ─────────────────────────────────────── */}
      <Link href={`/menu/${food.slug}`} className="relative h-52 overflow-hidden bg-[#FFF5E9] flex-shrink-0 block">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={food.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#B5957D]">
            <Utensils size={48} strokeWidth={1} />
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Tags — Bestseller / Featured */}
        {(food.isBestSeller || food.isFeatured) && (
          <div className="absolute top-3 left-3 bg-[#E8441A] text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            {food.isBestSeller ? (
              <><Flame size={10} /> Bestseller</>
            ) : (
              <><Star size={10} fill="white" /> Featured</>
            )}
          </div>
        )}

        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); setLiked(l => !l); }}
          aria-label="Toggle favourite"
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform cursor-pointer"
        >
          <Heart
            size={14}
            className={`transition-colors duration-150 ${liked ? 'text-[#DC2626] fill-[#DC2626]' : 'text-[#8C6E5A]'}`}
          />
        </button>

        {/* Veg/NonVeg badge */}
        <div className="absolute bottom-3 left-3">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border-2 bg-white ${typeConfig.border} ${typeConfig.text}`}>
            <span className={`w-2 h-2 rounded-full ${typeConfig.dot}`} />
            {typeConfig.label}
          </span>
        </div>

        {/* Unavailable overlay */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white text-[#1A1208] text-xs font-bold px-3 py-1.5 rounded-full">Currently Unavailable</span>
          </div>
        )}
      </Link>

      {/* ── Content ───────────────────────────────────── */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        {/* Name + Rating */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-[#1A1208] text-sm leading-snug flex-1 line-clamp-1">{food.name}</h3>
          {food.rating > 0 && (
            <span className="text-[11px] font-bold text-[#F59E0B] shrink-0 flex items-center gap-0.5">
              <Star size={10} fill="#F59E0B" className="text-[#F59E0B]" />
              {food.rating.toFixed(1)}
              {food.ratingCount > 0 && <span className="text-[#B5957D] font-normal">({food.ratingCount})</span>}
            </span>
          )}
        </div>

        {/* Description */}
        {food.description && (
          <p className="text-[#8C6E5A] text-xs leading-relaxed line-clamp-2">{food.description}</p>
        )}

        {/* Metadata row */}
        <div className="flex items-center gap-3 text-xs text-[#B5957D]">
          <span className="flex items-center gap-1">
            <Clock size={11} /> {food.preparationTime} min
          </span>
          {food.variants.length > 1 && (
            <>
              <span>·</span>
              <span>{food.variants.length} sizes</span>
            </>
          )}
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#F0E6D8]">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-[#1A1208]">
              {food.variants.length > 1 ? 'From ' : ''}₹{displayPrice}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!isAvailable}
            aria-label={`Add ${food.name} to cart`}
            className={`flex items-center gap-1.5 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all duration-150 active:scale-95 cursor-pointer shadow-sm disabled:cursor-not-allowed ${
              added
                ? 'bg-[#16A34A] shadow-[#16A34A]/30'
                : isAvailable
                  ? 'bg-[#E8441A] hover:bg-[#C93B15] shadow-[#E8441A]/20'
                  : 'bg-[#F0E6D8] text-[#B5957D] shadow-none'
            }`}
          >
            {added ? <><Check size={12} /> Added</> : <><Plus size={12} /> Add</>}
          </button>
        </div>
      </div>
    </div>
  );
}


