'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFoodBySlug } from '@/features/food/hooks/useFoodBySlug';
import { useAddToCart, extractCartError } from '@/features/cart/hooks/useAddToCart';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import type { ApiVariant } from '@/features/food/types/food.types';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/useToast';
import { Utensils, Pizza, ShoppingCart, Clock, Check, Plus, Minus, ArrowLeft, Star, Flame } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/Badge';

/* ─────────────────────── FOOD TYPE CONFIG ─────────────────────── */
const FOOD_TYPE = {
  Veg:    { label: 'Veg',    dot: 'bg-green-600', border: 'border-green-600', text: 'text-green-700', bg: 'bg-green-50' },
  Vegan:  { label: 'Vegan',  dot: 'bg-green-500', border: 'border-green-500', text: 'text-green-700', bg: 'bg-green-50' },
  NonVeg: { label: 'Non Veg',dot: 'bg-red-600',   border: 'border-red-600',   text: 'text-red-700',   bg: 'bg-red-50'   },
  Jain:   { label: 'Jain',   dot: 'bg-amber-500', border: 'border-amber-500', text: 'text-amber-700', bg: 'bg-amber-50' },
  Egg:    { label: 'Egg',    dot: 'bg-yellow-500',border: 'border-yellow-500',text: 'text-yellow-700',bg: 'bg-yellow-50'},
} as const;

/* ─────────────────────── SKELETON ─────────────────────── */
function FoodDetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#FFFBF5]">
      <div className="h-16 bg-white border-b border-[#F0E6D8]" />
      <div className="max-w-6xl mx-auto px-6 py-10 grid lg:grid-cols-2 gap-16">
        <Skeleton className="h-[460px] rounded-3xl" />
        <div className="flex flex-col gap-5 pt-4">
          <Skeleton className="h-4 w-24 rounded-full" shape="text" />
          <Skeleton className="h-10 w-4/5 rounded-2xl" shape="text" />
          <Skeleton className="h-4 w-1/3 rounded-full" shape="text" />
          <Skeleton className="h-20 rounded-2xl" />
          <div className="flex gap-3 mt-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 flex-1 rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-14 rounded-2xl mt-4" />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── VARIANT CARD ─────────────────────── */
function VariantCard({
  variant, isSelected, onClick,
}: { variant: ApiVariant; isSelected: boolean; onClick: () => void }) {
  const unavailable = !variant.isAvailable;
  return (
    <button
      onClick={onClick}
      disabled={unavailable}
      className={`relative w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer active:scale-[0.98] ${
        unavailable
          ? 'border-[#F0E6D8] bg-[#FAFAFA] opacity-50 cursor-not-allowed'
          : isSelected
            ? 'border-[#E8441A] bg-[#FFF5F0] shadow-[0_4px_14px_rgba(232,68,26,0.1)]'
            : 'border-[#F0E6D8] bg-white hover:border-[#E8441A]/50 hover:bg-[#FFFAF8]'
      }`}
    >
      {isSelected && (
        <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-[#E8441A] flex items-center justify-center">
          <Check size={12} className="text-white" strokeWidth={3} />
        </span>
      )}
      <p className={`text-sm font-bold mb-1 ${isSelected ? 'text-[#E8441A]' : 'text-[#1A1208]'}`}>{variant.name}</p>
      <p className="text-lg font-black text-[#1A1208]">₹{variant.price}</p>
      {variant.preparationTime && (
        <p className="text-[11px] text-[#B5957D] mt-0.5 flex items-center gap-1">
          <Clock size={10} /> {variant.preparationTime} min
        </p>
      )}
      {unavailable && (
        <p className="text-[11px] text-red-400 font-semibold mt-1">Unavailable</p>
      )}
    </button>
  );
}

/* ─────────────────────── QUANTITY SELECTOR ─────────────────────── */
function QuantitySelector({
  value, onChange,
}: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-0 border-2 border-[#F0E6D8] rounded-2xl overflow-hidden w-fit">
      <button
        onClick={() => onChange(Math.max(1, value - 1))}
        className="w-11 h-11 flex items-center justify-center text-[#E8441A] hover:bg-[#FFF0EB] transition-colors cursor-pointer"
      >
        <Minus size={18} strokeWidth={2.5} />
      </button>
      <span className="w-10 text-center font-bold text-[#1A1208] text-sm">{value}</span>
      <button
        onClick={() => onChange(Math.min(20, value + 1))}
        className="w-11 h-11 flex items-center justify-center text-[#E8441A] hover:bg-[#FFF0EB] transition-colors cursor-pointer"
      >
        <Plus size={18} strokeWidth={2.5} />
      </button>
    </div>
  );
}

/* ─────────────────────── MAIN CLIENT ─────────────────────── */
interface FoodDetailClientProps { slug: string }

export default function FoodDetailClient({ slug }: FoodDetailClientProps) {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();
  const { itemCount } = useCartStore();
  const { toast } = useToast();

  const { data: food, isLoading, isError } = useFoodBySlug(slug);
  const { mutate: addToCart, isPending: addingToCart } = useAddToCart();

  const [selectedVariant, setSelectedVariant] = React.useState<ApiVariant | null>(null);
  const [quantity, setQuantity] = React.useState(1);
  const [activeImage, setActiveImage] = React.useState(0);

  // Auto-select first available variant
  React.useEffect(() => {
    if (food?.variants?.length) {
      const first = food.variants.find(v => v.isAvailable) ?? food.variants[0];
      setSelectedVariant(first);
    }
  }, [food]);

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      router.push(`/login?redirect=/menu/${slug}`);
      return;
    }
    if (!selectedVariant) {
      toast.error('Please select a size first.');
      return;
    }
    addToCart({ variant: selectedVariant._id, quantity }, {
      onSuccess: () => toast.success(`${food?.name} (${selectedVariant.name}) added to cart!`),
      onError: (err) => toast.error(extractCartError(err)),
    });
  };

  const typeConfig = food ? (FOOD_TYPE[food.foodType] ?? FOOD_TYPE.Veg) : null;

  /* ── Loading ── */
  if (isLoading) return <FoodDetailSkeleton />;

  /* ── Error / Not Found ── */
  if (isError || !food) {
    return (
      <div className="min-h-screen bg-[#FFFBF5] flex items-center justify-center px-6">
        <EmptyState
          icon={<Utensils size={40} />}
          title="This dish isn't on the menu"
          description="It may have been removed or the link is incorrect."
          action={{
            label: 'Back to Menu',
            onClick: () => router.push('/#menu'),
          }}
          className="scale-110"
        />
      </div>
    );
  }

  const displayPrice = selectedVariant?.price ?? food.basePrice;
  const availableVariants = food.variants.filter(v => v.isAvailable);
  const isAvailable = food.isAvailable && availableVariants.length > 0;

  return (
    <div className="min-h-screen bg-[#FFFBF5] text-[#1A1208] font-[family-name:var(--font-inter)]">
      {/* ── Top Nav ── */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-[#F0E6D8] sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-[#F0E6D8] bg-white text-[#1A1208] hover:bg-[#F0E6D8]/30 transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#E8441A] to-[#F59E0B] flex items-center justify-center text-white">
                <Pizza size={16} />
              </div>
              <span className="font-extrabold text-[#1A1208] font-[family-name:var(--font-outfit)]">Swadesh</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/#menu" className="text-sm font-semibold text-[#8C6E5A] bg-[#FFF5E9] px-4 py-2 rounded-xl hover:bg-[#FFE4D6] transition-colors">
              Menu
            </Link>
            <button
              onClick={() => isLoggedIn ? router.push('/cart') : router.push('/login?redirect=/cart')}
              className="relative w-10 h-10 rounded-xl border border-[#F0E6D8] bg-white flex items-center justify-center text-[#1A1208] hover:bg-[#F0E6D8]/30 transition-colors"
            >
              <ShoppingCart size={18} />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#E8441A] text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Breadcrumb ── */}
      <div className="max-w-6xl mx-auto px-6 pt-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#B5957D]">
          <Link href="/" className="hover:text-[#E8441A] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/#menu" className="hover:text-[#E8441A] transition-colors">Menu</Link>
          <span>/</span>
          <span className="text-[#1A1208]">{food.name}</span>
        </div>
      </div>

      {/* ── Main Content ── */}
      <main className="max-w-6xl mx-auto px-6 py-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          {/* ── LEFT: Image Gallery ── */}
          <div className="w-full">
            {/* Main image */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#FFF5E9] to-[#FFE8D0] aspect-square shadow-[0_24px_60px_rgba(232,68,26,0.08)]">
              {food.images[activeImage]?.url ? (
                <img
                  src={food.images[activeImage].url}
                  alt={food.name}
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#B5957D]">
                  <Utensils size={80} strokeWidth={1} />
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-5 left-5 flex gap-2">
                {food.isBestSeller && (
                  <Badge variant="success" className="bg-[#E8441A] text-white border-[#E8441A] py-1.5 px-3">
                    <Flame size={12} className="mr-1" /> Bestseller
                  </Badge>
                )}
                {food.isFeatured && !food.isBestSeller && (
                  <Badge variant="warning" className="py-1.5 px-3">
                    <Star size={12} className="mr-1" /> Featured
                  </Badge>
                )}
              </div>

              {!isAvailable && (
                <div className="absolute inset-0 bg-[#1A1208]/60 flex items-center justify-center backdrop-blur-sm">
                  <span className="bg-white text-[#1A1208] font-bold text-sm px-6 py-3 rounded-2xl shadow-xl">
                    Currently Unavailable
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail strip */}
            {food.images.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2 scrollbar-none">
                {food.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-16 h-16 rounded-2xl overflow-hidden border-2 shrink-0 transition-colors ${
                      activeImage === i ? 'border-[#E8441A]' : 'border-[#F0E6D8]'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: Details ── */}
          <div className="flex flex-col">
            {/* Category + type */}
            <div className="flex items-center gap-3 mb-4">
              {food.category && (
                <span className="text-xs font-bold text-[#E8441A] bg-[#FFF0EB] px-3 py-1.5 rounded-full">
                  {food.category.name}
                </span>
              )}
              {typeConfig && (
                <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-full border-1.5 ${typeConfig.border} ${typeConfig.text} ${typeConfig.bg}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${typeConfig.dot}`} />
                  {typeConfig.label}
                </span>
              )}
            </div>

            {/* Name */}
            <h1 className="text-3xl lg:text-4xl font-black text-[#1A1208] font-[family-name:var(--font-outfit)] leading-tight mb-3">
              {food.name}
            </h1>

            {/* Rating */}
            {food.rating > 0 && (
              <div className="flex items-center gap-2 mb-5">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} size={16} className={i <= Math.round(food.rating) ? 'fill-[#F59E0B] text-[#F59E0B]' : 'fill-[#E2D5C3] text-[#E2D5C3]'} />
                  ))}
                </div>
                <span className="text-sm font-bold text-[#1A1208]">{food.rating.toFixed(1)}</span>
                {food.ratingCount > 0 && <span className="text-xs font-medium text-[#B5957D]">({food.ratingCount} reviews)</span>}
              </div>
            )}

            {/* Description */}
            {food.description && (
              <p className="text-sm text-[#8C6E5A] leading-relaxed mb-8">
                {food.description}
              </p>
            )}

            {/* Variant Selector */}
            {food.variants.length > 0 && (
              <div className="mb-8">
                <p className="text-[11px] font-extrabold text-[#B5957D] uppercase tracking-wider mb-3">
                  Choose Size
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {food.variants.map(v => (
                    <VariantCard
                      key={v._id}
                      variant={v}
                      isSelected={selectedVariant?._id === v._id}
                      onClick={() => { if (v.isAvailable) setSelectedVariant(v); }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Price Display */}
            <div className="flex items-center gap-4 mb-8 p-5 bg-white rounded-3xl border-2 border-[#F0E6D8] shadow-sm">
              <div className="flex-1">
                <p className="text-[11px] font-extrabold text-[#B5957D] uppercase tracking-wider mb-1">Total Price</p>
                <p className="text-3xl font-black text-[#E8441A] font-[family-name:var(--font-outfit)] leading-none">
                  ₹{displayPrice * quantity}
                </p>
                {quantity > 1 && (
                  <p className="text-[11px] font-semibold text-[#B5957D] mt-1.5">₹{displayPrice} × {quantity}</p>
                )}
              </div>
              <div className="w-px h-12 bg-[#F0E6D8] shrink-0" />
              <div className="flex-1 px-2">
                <p className="text-[11px] font-extrabold text-[#B5957D] uppercase tracking-wider mb-1.5">Prep Time</p>
                <p className="text-sm font-bold text-[#1A1208] flex items-center gap-1.5">
                  <Clock size={16} className="text-[#E8441A]" />
                  {selectedVariant?.preparationTime ?? food.preparationTime} min
                </p>
              </div>
            </div>

            {/* Tags */}
            {food.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {food.tags.map(tag => (
                  <span key={tag} className="text-[11px] font-bold text-[#8C6E5A] bg-[#FFF5E9] border border-[#F0E6D8] px-3 py-1.5 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div className="flex gap-4 items-center">
              <QuantitySelector value={quantity} onChange={setQuantity} />
              <Button
                variant="primary"
                onClick={handleAddToCart}
                disabled={!isAvailable || addingToCart}
                isLoading={addingToCart}
                className="flex-1 py-4 text-[15px] h-auto shadow-[0_8px_24px_rgba(232,68,26,0.3)] hover:scale-[1.02]"
              >
                {!addingToCart && isAvailable && <ShoppingCart size={18} className="mr-2" />}
                {isAvailable ? `Add to Cart — ₹${displayPrice * quantity}` : 'Currently Unavailable'}
              </Button>
            </div>

            {/* Login nudge */}
            {!isLoggedIn && (
              <p className="text-xs font-medium text-[#B5957D] mt-4 text-center">
                <Link href={`/login?redirect=/menu/${slug}`} className="text-[#E8441A] font-bold hover:underline">Sign in</Link> to add items to your cart.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

