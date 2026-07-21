'use client';

import * as React from 'react';
import { useAuthStore } from '../../../store/authStore';
import { NotificationDropdown } from '../../notification/components/NotificationDropdown';

export function AdminTopbar() {
  const { user } = useAuthStore();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        {/* Mobile menu button could go here */}
        <h2 className="text-sm font-semibold text-gray-500 hidden sm:block tracking-wide">RESTAURANT OPERATIONS</h2>
      </div>

      <div className="flex items-center gap-5">
        <NotificationDropdown isAdmin={true} />

        <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>

        {user && (
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-sm font-bold text-gray-900 leading-tight">{user.name}</span>
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest">{user.role}</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-gray-800 to-gray-600 flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-white">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
