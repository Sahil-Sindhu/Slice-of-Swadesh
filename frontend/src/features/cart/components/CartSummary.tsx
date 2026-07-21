import * as React from 'react';
import type { ApiCart } from '../types/cart.types';
import { Button } from '@/components/ui/Button';
import { ShoppingCart, Lock } from 'lucide-react';

export interface CartSummaryProps {
  cart: ApiCart;
  itemCount: number;
  checkingOut: boolean;
  anyMutating: boolean;
  onCheckout: (paymentMethod: string) => void;
}

export function CartSummary({ cart, itemCount, checkingOut, anyMutating, onCheckout }: CartSummaryProps) {
  const [paymentMethod, setPaymentMethod] = React.useState<'mock' | 'razorpay' | 'counter'>('mock');
  const disableCheckout = checkingOut || anyMutating || cart.items.length === 0;

  return (
    <div className="bg-white rounded-3xl border-2 border-[#F0E6D8] p-6 lg:p-8 sticky top-24 shadow-sm">
      <h2 className="text-2xl font-black text-[#1A1208] mb-8 font-[family-name:var(--font-outfit)]">Order Summary</h2>
      
      <div className="space-y-4 mb-8">
        <div className="flex justify-between text-[#8C6E5A] font-medium">
          <span>Subtotal ({itemCount} items)</span>
          <span className="text-[#1A1208] font-bold">₹{cart.subtotal.toFixed(2)}</span>
        </div>
        
        {cart.discount > 0 && (
          <div className="flex justify-between text-green-600 font-bold">
            <span>Discount</span>
            <span>-₹{cart.discount.toFixed(2)}</span>
          </div>
        )}
        
        <div className="flex justify-between text-[#8C6E5A] font-medium">
          <span>Taxes (5%)</span>
          <span className="text-[#1A1208] font-bold">₹{cart.tax.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-[#8C6E5A] font-medium pt-4 border-t border-[#F0E6D8]">
          <span>Delivery Fee</span>
          {((cart as any).deliveryFee || 0) === 0 ? (
            <span className="text-green-600 font-bold">FREE</span>
          ) : (
            <span className="text-[#1A1208] font-bold">₹{((cart as any).deliveryFee || 0).toFixed(2)}</span>
          )}
        </div>
      </div>
      
      <div className="flex justify-between items-end mb-8 pt-6 border-t-2 border-[#F0E6D8]">
        <div>
          <div className="text-sm font-bold text-[#8C6E5A] uppercase tracking-wider mb-1">Total Amount</div>
          <div className="text-3xl font-black text-[#E8441A] font-[family-name:var(--font-outfit)]">
            ₹{cart.grandTotal.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-sm font-bold text-[#8C6E5A] uppercase tracking-wider mb-4">Choose Payment Method</h3>
        <div className="space-y-3">
          <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-colors ${paymentMethod === 'mock' ? 'border-[#E8441A] bg-[#FFF0EB]' : 'border-[#F0E6D8] hover:border-[#E8441A] hover:bg-[#FFF0EB]'}`}>
            <input type="radio" name="payment" value="mock" checked={paymentMethod === 'mock'} onChange={() => setPaymentMethod('mock')} className="mr-3 accent-[#E8441A]" />
            <span className="font-bold text-[#1A1208]">Mock Payment</span>
          </label>
          <label className="flex items-center p-4 border-2 border-[#F0E6D8] rounded-xl cursor-not-allowed opacity-60">
            <input type="radio" name="payment" value="razorpay" disabled className="mr-3" />
            <div className="flex flex-col">
              <span className="font-bold text-[#1A1208]">Razorpay</span>
              <span className="text-xs text-[#E8441A] font-bold">Coming Soon</span>
            </div>
          </label>
          <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-colors ${paymentMethod === 'counter' ? 'border-[#E8441A] bg-[#FFF0EB]' : 'border-[#F0E6D8] hover:border-[#E8441A] hover:bg-[#FFF0EB]'}`}>
            <input type="radio" name="payment" value="counter" checked={paymentMethod === 'counter'} onChange={() => setPaymentMethod('counter')} className="mr-3 accent-[#E8441A]" />
            <span className="font-bold text-[#1A1208]">Pay at Counter</span>
          </label>
        </div>
      </div>
      
      <Button
        variant="primary"
        className="w-full py-4 text-base shadow-[0_8px_24px_rgba(232,68,26,0.3)] mb-4"
        onClick={() => onCheckout(paymentMethod)}
        disabled={disableCheckout}
      >
        {checkingOut ? 'Processing...' : (
          <>
            <ShoppingCart size={18} className="mr-2" />
            Proceed to Checkout
          </>
        )}
      </Button>

      <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#B5957D] uppercase tracking-wider">
        <Lock size={14} /> Secure Checkout
      </div>
    </div>
  );
}
