'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { useFoods, useCategories, FoodCard, FoodGridSkeleton, CategoryFilter } from '../features/menu';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Button } from '@/components/ui/Button';
import { NotificationDropdown } from '../features/notification/components/NotificationDropdown';
import type { ApiFood, FoodsQueryParams } from '../features/menu';
import { 
  Pizza, ShoppingCart, Search, X, Zap, Star, Flame, 
  MapPin, Clock, ArrowRight, ShieldCheck, Mail, Check,
  Leaf, Medal, Heart, ChevronLeft, ChevronRight, CheckCircle2,
  Phone, MoveRight
} from 'lucide-react';

/* --- STATIC DATA --- */
const REVIEWS = [
  {
    name: 'Amit Sharma', role: 'Tech Lead, Bengaluru', stars: 5,
    text: 'The Tandoori Naan Pizza is unlike anything I\'ve had before. Perfectly crispy, smoky, and delivers in 25 mins flat!',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=80',
  },
  {
    name: 'Priya Patel', role: 'Food Blogger', stars: 5,
    text: 'Swadesh nails the Indian fusion concept. The cardamom burger is mind-blowing. My whole family is obsessed!',
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=80',
  },
  {
    name: 'Rohan Kapoor', role: 'Startup Founder', stars: 5,
    text: 'Fast delivery, gorgeous packaging, and the saffron milkshake is the best I\'ve ever tasted. 10/10 experience.',
    img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=80',
  },
];

/* --- NAVBAR --- */
function HomeNavbar() {
  const { isLoggedIn, user, logout } = useAuthStore();
  const { itemCount } = useCartStore();
  const router = useRouter();
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-md border-b border-[#F0E6D8] shadow-[0_2px_20px_rgba(26,18,8,0.07)]' 
        : 'bg-white/85 backdrop-blur-md border-b border-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-6 h-[70px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E8441A] to-[#F59E0B] flex items-center justify-center text-white">
            <Pizza size={18} />
          </div>
          <div>
            <div className="text-lg font-black text-[#1A1208] font-[family-name:var(--font-outfit)] leading-none">Swadesh</div>
            <div className="text-[9px] text-[#B5957D] font-bold tracking-widest uppercase mt-0.5">Indian Fusion</div>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {[['#menu','Menu'],['#why-us','Why Us'],['#gallery','Gallery'],['#reviews','Reviews']].map(([href, label]) => (
            <a key={href} href={href} className="px-4 py-2 rounded-xl text-sm font-semibold text-[#4A3728] hover:bg-[#FFF0EB] hover:text-[#E8441A] transition-colors">
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => isLoggedIn ? router.push('/cart') : router.push('/login?redirect=/cart')}
            className="relative w-10 h-10 rounded-xl border border-[#F0E6D8] bg-white flex items-center justify-center text-[#1A1208] hover:bg-[#F0E6D8]/30 transition-colors"
          >
            <ShoppingCart size={18} />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#E8441A] text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-sm border-2 border-[#FFFBF5]">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </button>

          {isLoggedIn && user ? (
            <>
              <div className="flex items-center gap-2 p-1.5 pr-3.5 rounded-xl border border-[#F0E6D8] bg-white cursor-pointer hover:bg-[#F0E6D8]/20 transition-colors"
                onClick={() => router.push('/profile')}>
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#E8441A] to-[#F59E0B] flex items-center justify-center text-white font-extrabold text-xs">
                  {user.name[0].toUpperCase()}
                </div>
                <span className="text-sm font-bold text-[#4A3728]">{user.name.split(' ')[0]}</span>
                <button onClick={(e) => { e.stopPropagation(); logout(); }} className="text-[10px] text-[#B5957D] hover:text-[#E8441A] transition-colors font-medium ml-1">Sign out</button>
              </div>
              <NotificationDropdown />
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="px-4 py-2 rounded-xl border-1.5 border-[#F0E6D8] bg-white text-[13px] font-bold text-[#4A3728] hover:bg-[#F0E6D8]/30 transition-colors">Sign In</Link>
              <Link href="/register" className="px-4 py-2 rounded-xl bg-[#E8441A] text-white text-[13px] font-bold shadow-[0_4px_14px_rgba(232,68,26,0.3)] hover:bg-[#C93B15] transition-colors">Join Free</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

/* --- SEARCH BAR --- */
function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative max-w-md w-full group">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B5957D] group-focus-within:text-[#E8441A] transition-colors" size={18} />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Search pizzas, burgers, shakes..."
        className="w-full pl-11 pr-10 py-3 rounded-2xl border-2 border-[#F0E6D8] bg-white text-[#1A1208] text-sm font-medium placeholder:text-[#B5957D] focus:outline-none focus:border-[#E8441A] focus:shadow-[0_0_0_4px_rgba(232,68,26,0.1)] transition-all"
      />
      {value && (
        <button onClick={() => onChange('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#B5957D] hover:text-[#E8441A] transition-colors">
          <X size={16} />
        </button>
      )}
    </div>
  );
}

/* --- PAGINATION --- */
function Pagination({ page, totalPages, onPageChange }: { page: number; totalPages: number; onPageChange: (p: number) => void }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      <button onClick={() => onPageChange(page - 1)} disabled={page === 1}
        className="w-10 h-10 flex items-center justify-center rounded-xl border border-[#F0E6D8] bg-white text-[#4A3728] disabled:opacity-40 hover:border-[#E8441A] hover:text-[#E8441A] transition-colors disabled:cursor-not-allowed">
        <ChevronLeft size={18} strokeWidth={2.5} />
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
        <button key={p} onClick={() => onPageChange(p)}
          className={`w-10 h-10 rounded-xl border font-bold text-sm transition-all ${
            p === page 
              ? 'bg-[#E8441A] border-[#E8441A] text-white shadow-sm' 
              : 'bg-white border-[#F0E6D8] text-[#4A3728] hover:border-[#E8441A] hover:text-[#E8441A]'
          }`}>
          {p}
        </button>
      ))}
      <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages}
        className="w-10 h-10 flex items-center justify-center rounded-xl border border-[#F0E6D8] bg-white text-[#4A3728] disabled:opacity-40 hover:border-[#E8441A] hover:text-[#E8441A] transition-colors disabled:cursor-not-allowed">
        <ChevronRight size={18} strokeWidth={2.5} />
      </button>
    </div>
  );
}

/* --- MENU SECTION --- */
function MenuSection({
  activeCategory,
  setActiveCategory,
  categories,
  catLoading
}: {
  activeCategory: string;
  setActiveCategory: React.Dispatch<React.SetStateAction<string>>;
  categories: any;
  catLoading: boolean;
}) {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();
  const [search, setSearch] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [page, setPage] = React.useState(1);

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  React.useEffect(() => { setPage(1); }, [activeCategory, debouncedSearch]);

  const queryParams: FoodsQueryParams = {
    page,
    limit: 12,
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(activeCategory !== 'all' && { category: activeCategory }),
  };

  const { data, isLoading, isError, refetch } = useFoods(queryParams);

  const handleAddToCart = (food: ApiFood) => {
    if (!isLoggedIn) {
      router.push(`/login?redirect=/cart`);
      return;
    }
    router.push('/cart');
  };

  return (
    <section id="menu" className="py-16 px-6 bg-[#FFFBF5]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-block bg-[#FFF0EB] text-[#E8441A] rounded-full px-5 py-1.5 text-xs font-bold tracking-widest uppercase mb-4">
            Our Craft Menu
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-[#1A1208] font-[family-name:var(--font-outfit)] mb-4">
            Handcrafted With Love &amp; Spice
          </h2>
          <p className="text-[#8C6E5A] text-[15px] max-w-lg mx-auto font-medium">
            Every dish tells a story — from clay ovens to modern grills, organic spices to artisanal sauces.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <SearchBar value={search} onChange={setSearch} />
          {data && (
            <p className="text-sm font-medium text-[#8C6E5A] shrink-0">
              <span className="font-black text-[#1A1208]">{data.pagination.total}</span> items found
            </p>
          )}
        </div>

        {isLoading ? (
          <FoodGridSkeleton count={12} />
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : data?.foods.length === 0 ? (
          <EmptyState
            title={debouncedSearch ? `No results for "${debouncedSearch}"` : 'No foods in this category'}
            action={{
              label: 'Reset Filters',
              onClick: () => { setSearch(''); setActiveCategory('all'); }
            }}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data?.foods.map(food => (
                <FoodCard key={food._id} food={food} onAddToCart={handleAddToCart} />
              ))}
            </div>
            {data?.pagination && (
              <Pagination
                page={data.pagination.page}
                totalPages={data.pagination.totalPages}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </div>
    </section>
  );
}

/* --- MAIN PAGE --- */
export default function HomeClient() {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();
  const [emailValue, setEmailValue] = React.useState('');
  const [subscribed, setSubscribed] = React.useState(false);
  const { data: categories, isLoading: catLoading } = useCategories();
  const [activeCategory, setActiveCategory] = React.useState('all');

  const handleOrder = () => {
    if (!isLoggedIn) router.push('/login?redirect=/cart');
    else router.push('/cart');
  };

  return (
    <div className="bg-[#FFFBF5] text-[#1A1208] min-h-screen font-[family-name:var(--font-inter)]">
      {/* Announcement bar */}
      <div className="bg-gradient-to-r from-[#C93B15] via-[#E8441A] to-[#C93B15] text-white text-center py-2.5 px-4 text-[13px] font-bold tracking-wide">
        <span className="flex items-center justify-center gap-2">
          <Flame size={14} /> Monsoon Special - 20% off orders above ₹499 <span className="hidden sm:inline">|</span> Use code <strong className="bg-white/20 px-2 py-0.5 rounded text-white">SWADESH20</strong>
        </span>
      </div>

      <HomeNavbar />

      {/* HERO */}
      <section className="bg-gradient-to-br from-[#FF6B35] via-[#E8441A] to-[#C93B15] pt-[70px] px-6 relative overflow-hidden min-h-[560px]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.07)_0%,transparent_50%),radial-gradient(circle_at_20%_80%,rgba(0,0,0,0.08)_0%,transparent_50%)]" />
        <div className="absolute bottom-0 left-[30%] w-[600px] h-[300px] rounded-t-full bg-[#FFFBF5]" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
            <div className="pb-20 pt-10">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/30 rounded-full px-4 py-1.5 mb-6 shadow-sm">
                <MapPin size={14} className="text-white" />
                <span className="text-white text-xs font-bold tracking-widest uppercase">Modern Indian Fast Food</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-5 font-[family-name:var(--font-outfit)]">
                Where Tradition<br />Meets the{' '}
                <span className="bg-gradient-to-br from-[#FFDD57] to-[#F59E0B] text-transparent bg-clip-text drop-shadow-sm">Modern Slice</span>
              </h1>
              <p className="text-white/85 text-base sm:text-lg leading-relaxed max-w-md mb-8 font-medium">
                Hand-stretched tandoori naan pizzas, double-patty cardamom burgers &amp; saffron milkshakes — built fresh, delivered fast.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" onClick={handleOrder} className="bg-white text-[#E8441A] hover:bg-[#FFF0EB] hover:scale-105 shadow-[0_8px_24px_rgba(0,0,0,0.15)] py-3.5 px-8">
                  <ShoppingCart size={18} className="mr-2" /> Order Now
                </Button>
                <Button variant="outline" onClick={() => { document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' }) }} className="border-2 border-white/50 text-white hover:bg-white/10 backdrop-blur-sm py-3.5 px-8">
                  Explore Menu
                </Button>
              </div>
              <div className="flex flex-wrap gap-8 mt-12">
                {[
                  { val: '15,000+', label: 'Happy Foodies' },
                  { val: '4.9 ★', label: 'Google Rating' },
                  { val: '< 30 min', label: 'Avg Delivery' }
                ].map(({ val, label }) => (
                  <div key={label}>
                    <div className="text-white font-black text-2xl font-[family-name:var(--font-outfit)]">{val}</div>
                    <div className="text-white/70 text-xs font-semibold uppercase tracking-wider">{label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="hidden lg:flex justify-center items-end relative h-[420px]">
              <div className="absolute bottom-[60px] left-1/2 -translate-x-1/2 w-[280px] h-[280px] rounded-full bg-white/10 animate-pulse" />
              <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600" alt="Tandoori Naan Pizza"
                className="w-[300px] h-[300px] object-cover rounded-full border-[6px] border-white shadow-[0_24px_60px_rgba(0,0,0,0.25)] absolute bottom-10 left-1/2 -translate-x-1/2 hover:scale-105 transition-transform duration-500" />
              
              <div className="absolute top-[60px] right-5 bg-white rounded-2xl p-3 shadow-[0_8px_24px_rgba(0,0,0,0.12)] flex items-center gap-3 animate-bounce">
                <div className="w-10 h-10 rounded-full bg-[#FFF0EB] flex items-center justify-center text-[#E8441A]">
                  <Zap size={20} className="fill-[#E8441A]" />
                </div>
                <div>
                  <div className="text-sm font-black text-[#1A1208]">Express</div>
                  <div className="text-[10px] font-bold text-[#8C6E5A] uppercase tracking-wider">25 min delivery</div>
                </div>
              </div>

              <div className="absolute bottom-[160px] left-5 bg-white rounded-2xl p-3 shadow-[0_8px_24px_rgba(0,0,0,0.12)] flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FFF5E9] flex items-center justify-center text-[#F59E0B]">
                  <Star size={20} className="fill-[#F59E0B]" />
                </div>
                <div>
                  <div className="text-sm font-black text-[#1A1208]">4.9 / 5.0</div>
                  <div className="text-[10px] font-bold text-[#8C6E5A] uppercase tracking-wider">Google Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STICKY CATEGORY BAR */}
      <section className="bg-white px-6 border-b border-[#F0E6D8] sticky top-[70px] z-40 shadow-sm">
        <div className="max-w-6xl mx-auto py-4">
          <CategoryFilter
            categories={categories ?? []}
            activeCategory={activeCategory}
            onChange={setActiveCategory}
            isLoading={catLoading}
          />
        </div>
      </section>

      {/* LIVE MENU GRID */}
      <MenuSection activeCategory={activeCategory} setActiveCategory={setActiveCategory} categories={categories} catLoading={catLoading} />

      {/* TODAY'S SPECIAL */}
      <section className="bg-white py-16 px-6 border-t border-[#F0E6D8]">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-[32px] overflow-hidden bg-gradient-to-br from-[#1A1208] to-[#2D1A0A] grid grid-cols-1 lg:grid-cols-2 min-h-[380px] shadow-xl group cursor-pointer" onClick={handleOrder}>
            <div className="p-10 lg:p-14 flex flex-col justify-center gap-5">
              <span className="inline-flex items-center gap-1.5 bg-[#E8441A] text-white rounded-full px-4 py-1.5 text-xs font-bold w-max shadow-sm">
                <Flame size={14} /> Today's Special
              </span>
              <h2 className="text-white text-3xl lg:text-4xl font-black font-[family-name:var(--font-outfit)] leading-tight m-0">
                Double Paneer<br />Makhani Burger
              </h2>
              <p className="text-white/70 text-sm leading-relaxed m-0 max-w-md font-medium">
                Dual paneer steaks grilled to perfection, drenched in cardamom-infused makhani sauce, wrapped in toasted brioche.
              </p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-[#F59E0B] text-3xl font-black">₹320</span>
                <span className="text-white/30 text-lg font-bold line-through">₹400</span>
                <span className="bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30 rounded-lg px-3 py-1 text-xs font-bold uppercase tracking-wider">Save ₹80</span>
              </div>
              <Button variant="primary" className="w-max mt-2 py-3.5 px-8 shadow-[0_8px_24px_rgba(232,68,26,0.3)] group-hover:scale-105 group-hover:shadow-[0_12px_32px_rgba(232,68,26,0.4)]">
                Claim Offer <MoveRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            <div className="relative h-64 lg:h-auto overflow-hidden hidden sm:block">
              <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=700" alt="Special Burger" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#1A1208] via-[#1A1208]/50 to-transparent lg:via-[#1A1208]/20" />
            </div>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section id="why-us" className="py-20 px-6 bg-[#FFF5E9]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl lg:text-4xl font-black text-[#1A1208] font-[family-name:var(--font-outfit)] mb-3">Why Thousands Choose Swadesh</h2>
            <p className="text-[#8C6E5A] text-[15px] font-medium">We obsess over quality so you don't have to.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Leaf, color: 'text-green-500', bg: 'bg-green-50', title: '100% Fresh Grain', text: 'All crusts hand-stretched daily from flour sourced at local Swadesh farmer cooperatives.' },
              { icon: Zap, color: 'text-orange-500', bg: 'bg-orange-50', title: 'Express Delivery', text: 'Custom thermal carriers keep your pizza hot, crispy and your shake ice-cold on the way.' },
              { icon: ShieldCheck, color: 'text-blue-500', bg: 'bg-blue-50', title: 'Zero Preservatives', text: 'Real butter, organic cardamom, fresh saffron. No artificial additives. Ever.' },
              { icon: Medal, color: 'text-yellow-500', bg: 'bg-yellow-50', title: '4.9★ Google Rated', text: 'Over 15,000 happy customers and consistently top-rated in Bengaluru fast food.' },
            ].map(({ icon: Icon, color, bg, title, text }) => (
              <div key={title} className="bg-white rounded-3xl p-8 border-2 border-[#F0E6D8] hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(26,18,8,0.06)] hover:border-[#E8441A]/30 transition-all duration-300">
                <div className={`w-14 h-14 ${bg} ${color} rounded-2xl flex items-center justify-center mb-6`}>
                  <Icon size={28} strokeWidth={2} />
                </div>
                <h3 className="font-extrabold text-[#1A1208] text-lg mb-3">{title}</h3>
                <p className="text-[#8C6E5A] text-sm leading-relaxed m-0 font-medium">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="py-20 px-6 bg-[#FFFBF5] border-t border-[#F0E6D8]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-black text-[#1A1208] font-[family-name:var(--font-outfit)] mb-3">Our Culinary Gallery</h2>
            <p className="text-[#8C6E5A] text-[15px] font-medium">A visual feast before the real one.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-[160px_160px] md:grid-rows-[220px_220px] gap-4">
            {[
              { src: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800', alt: 'Pizza', className: 'col-span-2 row-span-2' },
              { src: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400', alt: 'Burger', className: 'col-span-1 row-span-1' },
              { src: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?q=80&w=400', alt: 'Shake', className: 'col-span-1 row-span-1' },
              { src: 'https://images.unsplash.com/photo-1621961404018-8199342e7b11?q=80&w=400', alt: 'Pasta', className: 'col-span-1 row-span-1' },
              { src: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=400', alt: 'Restaurant', className: 'col-span-1 row-span-1' },
            ].map(({ src, alt, className }, i) => (
              <div key={i} className={`rounded-2xl overflow-hidden relative group bg-[#F0E6D8] shadow-sm ${className}`}>
                <img src={src} alt={alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="py-20 px-6 bg-white border-t border-[#F0E6D8]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl lg:text-4xl font-black text-[#1A1208] font-[family-name:var(--font-outfit)] mb-3 flex items-center justify-center gap-3">
              <Heart size={36} className="text-[#E8441A] fill-[#E8441A]" /> Loved By Foodies
            </h2>
            <p className="text-[#8C6E5A] text-[15px] font-medium">Real reviews from real people.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REVIEWS.map((r, i) => (
              <div key={i} className="bg-[#FFFBF5] rounded-3xl p-8 border-2 border-[#F0E6D8] hover:border-[#E8441A]/30 hover:shadow-[0_12px_32px_rgba(232,68,26,0.06)] hover:-translate-y-1 transition-all duration-300">
                <div className="flex gap-1 mb-5">
                  {[...Array(r.stars)].map((_, i) => <Star key={i} size={18} className="text-[#F59E0B] fill-[#F59E0B]" />)}
                </div>
                <p className="text-[#4A3728] text-[15px] leading-relaxed mb-8 italic font-medium">"{r.text}"</p>
                <div className="flex items-center gap-4">
                  <img src={r.img} alt={r.name} className="w-12 h-12 rounded-full object-cover border-2 border-[#F0E6D8]" />
                  <div>
                    <div className="font-extrabold text-[#1A1208] text-sm">{r.name}</div>
                    <div className="text-[#B5957D] text-[11px] font-bold uppercase tracking-wider mt-0.5">{r.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-24 px-6 bg-gradient-to-br from-[#1A1208] to-[#2D1A0A] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm border border-white/20">
            <Mail size={36} className="text-white" strokeWidth={1.5} />
          </div>
          <h2 className="text-white text-3xl lg:text-4xl font-black font-[family-name:var(--font-outfit)] mb-5">Join the Swadesh Club</h2>
          <p className="text-white/70 text-[15px] leading-relaxed mb-10 max-w-lg mx-auto font-medium">
            Get weekly chef specials, exclusive member deals, and a <strong className="text-[#F59E0B]">₹150 welcome coupon</strong> right in your inbox.
          </p>
          {subscribed ? (
            <div className="bg-green-500/15 border-2 border-green-500/30 rounded-2xl p-5 text-green-400 font-bold flex items-center justify-center gap-3">
              <CheckCircle2 size={20} /> You're in! Check your inbox for your ₹150 coupon.
            </div>
          ) : (
            <form onSubmit={e => { e.preventDefault(); setSubscribed(true); }} className="flex flex-col sm:flex-row gap-3">
              <input type="email" value={emailValue} onChange={e => setEmailValue(e.target.value)} required placeholder="Enter your email address"
                className="flex-1 py-4 px-6 rounded-2xl border-2 border-white/15 bg-white/5 text-white placeholder:text-white/40 font-medium focus:outline-none focus:border-[#E8441A] focus:bg-white/10 transition-all shadow-inner" />
              <Button variant="primary" type="submit" className="py-4 px-8 text-[15px] shadow-[0_8px_24px_rgba(232,68,26,0.4)]">
                Subscribe
              </Button>
            </form>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0E0A06] pt-20 pb-8 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-16">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6 hover:opacity-90 transition-opacity w-max cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E8441A] to-[#F59E0B] flex items-center justify-center text-white">
                  <Pizza size={20} />
                </div>
                <span className="text-white font-black text-2xl font-[family-name:var(--font-outfit)]">Swadesh</span>
              </div>
              <p className="text-white/40 text-[13px] leading-relaxed max-w-xs font-medium">
                Traditional Indian flavours crafted into modern fast food perfection. Born in Bengaluru, loved across India.
              </p>
            </div>
            {[
              { title: 'Quick Links', links: [['#menu','Menu'],['#why-us','Why Us'],['#gallery','Gallery'],['#reviews','Reviews']] },
              { title: 'Legal', links: [['/privacy','Privacy Policy'],['/terms','Terms of Service'],['#','Refund Policy']] },
              { title: 'Contact', links: [['mailto:support@swadeshslice.com','support@swadeshslice.com'],['tel:+918049102000','+91 80 4910 2000']] },
            ].map(({ title, links }, i) => (
              <div key={title}>
                <h4 className="text-white/80 font-bold text-[11px] uppercase tracking-[2px] mb-6">{title}</h4>
                <div className="flex flex-col gap-4">
                  {links.map(([href, label]) => (
                    <a key={href} href={href} className="text-white/40 text-[13px] font-medium hover:text-[#E8441A] transition-colors w-max flex items-center gap-2 group">
                      {i === 2 && href.startsWith('mailto') && <Mail size={14} className="group-hover:text-[#E8441A] transition-colors" />}
                      {i === 2 && href.startsWith('tel') && <Phone size={14} className="group-hover:text-[#E8441A] transition-colors" />}
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-white/30 text-[11px] font-bold tracking-wide">
            © {new Date().getFullYear()} Slice of Swadesh. All rights reserved. Made with ❤️ in India.
          </div>
        </div>
      </footer>
    </div>
  );
}
