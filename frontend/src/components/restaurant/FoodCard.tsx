import * as React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { MenuItemInfo } from 'shared';

export interface FoodCardProps {
  item: MenuItemInfo;
  onAddToCart?: (item: MenuItemInfo) => void;
  onQuickView?: (item: MenuItemInfo) => void;
  onToggleFavorite?: (id: string) => void;
  isFavorite?: boolean;
}

export const FoodCard: React.FC<FoodCardProps> = ({
  item,
  onAddToCart,
  onQuickView,
  onToggleFavorite,
  isFavorite = false,
}) => {
  const { name, description, price, imageUrl, vegBadge, spiceLevel, preparationTime, rating, isAvailable } = item as any;

  return (
    <Card variant="interactive" className="group relative pt-4 flex flex-col justify-between h-[390px] w-full max-w-[280px] bg-card border border-border">
      {/* Floating Header Badges */}
      <div className="absolute top-3 left-3 z-10 flex gap-1.5">
        <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
          vegBadge === 'veg' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
        }`}>
          {vegBadge}
        </span>
        {preparationTime && (
          <span className="bg-background/80 dark:bg-background/60 backdrop-blur-md px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1">
            ⏱️ {preparationTime}m
          </span>
        )}
      </div>

      {/* Favorite Button */}
      <button
        onClick={() => onToggleFavorite?.(item.id)}
        className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-background/80 dark:bg-background/60 backdrop-blur-md text-foreground/75 hover:text-red-500 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
        aria-label="Add to favorites"
      >
        <svg
          className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-current'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>

      {/* Floating 3D Image Frame */}
      <div className="relative h-44 w-full flex items-center justify-center pt-2">
        <div className="absolute w-36 h-36 bg-[#E05A47]/5 rounded-full blur-xl group-hover:scale-125 transition-all duration-500 pointer-events-none" />
        <img
          src={imageUrl || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=300'}
          alt={name}
          className="w-36 h-36 object-contain rounded-full drop-shadow-xl group-hover:scale-110 group-hover:-translate-y-2 group-hover:rotate-6 transition-all duration-500 select-none"
        />
      </div>

      {/* Content */}
      <div className="px-4 pb-4 flex flex-col justify-between flex-grow">
        <div>
          <div className="flex items-center justify-between gap-1 mb-1">
            <h3 className="font-heading font-bold text-lg leading-tight truncate text-foreground group-hover:text-primary transition-colors duration-200">
              {name}
            </h3>
            {rating && (
              <span className="text-sm font-bold text-accent flex items-center gap-0.5 shrink-0">
                ⭐ {rating.average}
              </span>
            )}
          </div>
          <p className="text-xs text-foreground/60 font-sans line-clamp-2 leading-relaxed mb-3">
            {description}
          </p>
        </div>

        <div>
          {/* Spice indicators */}
          {spiceLevel > 0 && (
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <svg
                  key={i}
                  className={`w-3.5 h-3.5 ${i < spiceLevel ? 'text-primary fill-primary' : 'text-foreground/20'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                </svg>
              ))}
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center justify-between mt-auto">
            <span className="text-xl font-mono font-bold text-foreground">
              ₹{price}
            </span>
            <Button
              size="sm"
              disabled={!isAvailable}
              onClick={() => onAddToCart?.(item)}
              variant={isAvailable ? 'primary' : 'outline'}
              className="text-xs font-bold rounded-lg py-1 px-3"
            >
              {isAvailable ? 'Add To Cart' : 'Out of Stock'}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
