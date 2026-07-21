'use client';

import * as React from 'react';
import type { ApiCategory } from '../types/menu.types';
import { Utensils, Pizza, Coffee, CupSoda, Flame, Tag, Leaf, Beef } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface CategoryFilterProps {
  categories: ApiCategory[];
  activeCategory: string;     // '_id' or 'all'
  onChange: (id: string) => void;
  isLoading?: boolean;
}

const ALL_PILL = { _id: 'all', name: 'All', icon: Utensils };

// Map common category names to lucide icons
function getCategoryIcon(name: string): React.ElementType {
  const map: Record<string, React.ElementType> = {
    pizza: Pizza,
    burger: Beef,
    shake: CupSoda,
    chai: Coffee,
    coffee: Coffee,
    spicy: Flame,
    veg: Leaf,
  };
  const lower = name.toLowerCase();
  for (const [key, icon] of Object.entries(map)) {
    if (lower.includes(key)) return icon;
  }
  return Tag;
}

export function CategoryFilter({ categories, activeCategory, onChange, isLoading }: CategoryFilterProps) {
  const pills = [ALL_PILL, ...categories.map(c => ({ _id: c._id, name: c.name, icon: getCategoryIcon(c.name) }))];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none select-none w-full">
      {isLoading
        ? Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 w-28 rounded-full bg-[#F0E6D8] animate-pulse shrink-0" />
          ))
        : pills.map((cat) => {
            const isActive = cat._id === activeCategory;
            const Icon = cat.icon;
            return (
              <button
                key={cat._id}
                onClick={() => onChange(cat._id)}
                className={cn(
                  "flex items-center gap-1.5 px-5 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all duration-200 cursor-pointer border-none shrink-0",
                  isActive
                    ? "bg-[#E8441A] text-white shadow-[0_4px_14px_rgba(232,68,26,0.3)] scale-[1.04]"
                    : "bg-[#FFF0EB] text-[#E8441A] hover:bg-[#FFE4D6] scale-100 shadow-none"
                )}
              >
                <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                {cat.name}
              </button>
            );
          })}
    </div>
  );
}

