'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ClipboardList,
  Package,
  BarChart3,
  Users,
  Store,
  CreditCard,
  Brain,
  MessageSquare,
  Globe,
  UserCheck,
  Utensils
} from 'lucide-react';

const MENU_ITEMS = [
  { name: 'Dashboard',     href: '/dashboard/admin',         icon: LayoutDashboard },
  { name: 'Orders',        href: '/orders',                  icon: ClipboardList },
  { name: 'Payments',      href: '/payments',                icon: CreditCard },
  { name: 'Inventory',     href: '/dashboard/inventory',     icon: Package },
  { name: 'Analytics',     href: '/dashboard/analytics',     icon: BarChart3 },
  { name: 'CRM',           href: '/dashboard/crm',           icon: Users },
  { name: 'AI Assistant',  href: '/dashboard/ai',            icon: Brain },
  { name: 'Communication', href: '/dashboard/communication', icon: MessageSquare },
  { name: 'Franchise',     href: '/dashboard/franchise',     icon: Globe },
  { name: 'HRMS / Staff',  href: '/dashboard/employee',      icon: UserCheck },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#1A1208] text-white hidden md:flex flex-col border-r border-white/10 shrink-0 h-screen sticky top-0">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-white/10 shrink-0">
        <Link href="/dashboard/admin" className="flex items-center gap-3 no-underline">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E8441A] to-[#F59E0B] flex items-center justify-center shadow-[0_4px_12px_rgba(232,68,26,0.3)]">
            <Utensils size={14} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-wide text-white">SOS Admin</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1">
        {MENU_ITEMS.map(({ name, href, icon: Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={name}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 no-underline ${
                isActive
                  ? 'bg-[#E8441A]/15 text-[#FF8C69]'
                  : 'text-white/50 hover:bg-white/8 hover:text-white/80'
              }`}
            >
              <Icon size={16} className="flex-shrink-0" />
              {name}
            </Link>
          );
        })}
      </nav>

      {/* Footer — Storefront link */}
      <div className="p-4 border-t border-white/10 shrink-0">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:bg-white/8 hover:text-white/80 transition-all duration-150 no-underline"
        >
          <Store size={16} className="flex-shrink-0" />
          Storefront
        </Link>
      </div>
    </aside>
  );
}



