'use client';

import * as React from 'react';
import { Bell, Check, Trash } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead, getAdminNotifications } from '../api/notificationApi';
import { Badge } from '@/components/ui/Badge';
import { useAuthStore } from '../../../store/authStore';

interface NotificationDropdownProps {
  isAdmin?: boolean;
}

export function NotificationDropdown({ isAdmin = false }: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  // Close when clicked outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['unreadCount', isAdmin],
    queryFn: async () => {
      if (isAdmin) return 0; // Admin doesn't track global unread count like this, but let's keep it simple
      return getUnreadCount();
    },
    enabled: !!user && !isAdmin, // Only poll if logged in and not admin
    refetchInterval: 30000 // Poll every 30s
  });

  const { data: notificationsData, isLoading } = useQuery({
    queryKey: ['notifications', isAdmin],
    queryFn: () => isAdmin ? getAdminNotifications(1, 10) : getNotifications(1, 10),
    enabled: isOpen // Only fetch when dropdown is open
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
    }
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
    }
  });

  const notifications = notificationsData?.notifications || [];

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-[#8C6E5A] hover:bg-[#F0E6D8] transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && !isAdmin && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-[#E8441A] text-white text-[10px] font-bold flex items-center justify-center rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border-2 border-[#F0E6D8] overflow-hidden z-50">
          <div className="p-4 border-b-2 border-[#F0E6D8] flex items-center justify-between bg-[#FFFBF5]">
            <h3 className="font-bold text-[#1A1208]">Notifications</h3>
            {!isAdmin && notifications.length > 0 && (
              <button 
                onClick={() => markAllReadMutation.mutate()}
                className="text-xs font-semibold text-[#E8441A] hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center text-[#8C6E5A] text-sm">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-[#8C6E5A] text-sm">No notifications yet.</div>
            ) : (
              <div className="divide-y divide-[#F0E6D8]">
                {notifications.map((notif: any) => (
                  <div key={notif._id} className={`p-4 transition-colors ${!notif.read && !isAdmin ? 'bg-[#E8441A]/5' : 'hover:bg-[#FFFBF5]'}`}>
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-[#1A1208]">{notif.title}</span>
                          {!notif.read && !isAdmin && <div className="w-2 h-2 rounded-full bg-[#E8441A]" />}
                        </div>
                        <p className="text-xs text-[#8C6E5A] mb-2">{notif.message}</p>
                        <span className="text-[10px] font-bold text-[#8C6E5A]/60 uppercase tracking-wider">
                          {new Date(notif.createdAt).toLocaleString()}
                        </span>
                      </div>
                      {!notif.read && !isAdmin && (
                        <button 
                          onClick={() => markReadMutation.mutate(notif._id)}
                          className="p-1.5 rounded-lg text-[#8C6E5A] hover:bg-white hover:shadow-sm transition-all"
                          title="Mark as read"
                        >
                          <Check size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-3 border-t-2 border-[#F0E6D8] bg-[#FFFBF5] text-center">
            <button className="text-xs font-bold text-[#8C6E5A] hover:text-[#1A1208] transition-colors">
              View All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
