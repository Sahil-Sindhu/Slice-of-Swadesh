'use client';

import * as React from 'react';
import { Input } from '../../../../components/ui/Input';
import { Search } from 'lucide-react';

interface OrderFiltersProps {
  search: string;
  setSearch: (s: string) => void;
  status: string;
  setStatus: (s: string) => void;
  paymentStatus: string;
  setPaymentStatus: (s: string) => void;
}

export function OrderFilters({ search, setSearch, status, setStatus, paymentStatus, setPaymentStatus }: OrderFiltersProps) {
  // Use local state for search input to debounce
  const [localSearch, setLocalSearch] = React.useState(search);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(localSearch);
    }, 400); // 400ms debounce
    return () => clearTimeout(handler);
  }, [localSearch, setSearch]);

  return (
    <div className="bg-white p-4 rounded-2xl border border-[#F0E6D8] shadow-[0_4px_20px_-4px_rgba(26,18,8,0.06)] flex flex-col md:flex-row gap-4 items-center">
      <div className="flex-1 w-full relative">
        <Input
          type="text"
          placeholder="Search by Order No or Customer Name..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          leftIcon={<Search size={18} />}
        />
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full md:w-40 h-10 border border-[#F0E6D8] rounded-xl text-sm px-3 bg-[#FFFBF5] text-[#1A1208] focus:outline-none focus:ring-4 focus:ring-[#E8441A]/10 focus:border-[#E8441A] transition-all font-medium"
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Preparing">Preparing</option>
          <option value="Ready">Ready</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <select
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value)}
          className="w-full md:w-40 h-10 border border-[#F0E6D8] rounded-xl text-sm px-3 bg-[#FFFBF5] text-[#1A1208] focus:outline-none focus:ring-4 focus:ring-[#E8441A]/10 focus:border-[#E8441A] transition-all font-medium"
        >
          <option value="">All Payments</option>
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
          <option value="Failed">Failed</option>
          <option value="Refunded">Refunded</option>
        </select>
      </div>
    </div>
  );
}

