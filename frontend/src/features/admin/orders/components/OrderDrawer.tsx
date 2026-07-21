'use client';

import * as React from 'react';
import { IOrder, IOrderItem } from '../types/order.types';
import { useOrderTimeline, useUpdateOrderStatus } from '../hooks/useOrders';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../../../components/ui/Modal';
import { Button } from '../../../../components/ui/Button';

interface OrderDrawerProps {
  order: IOrder | null;
  onClose: () => void;
}

export function OrderDrawer({ order, onClose }: OrderDrawerProps) {
  const { data: timeline, isLoading: isTimelineLoading } = useOrderTimeline(order?._id || null);
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateOrderStatus();

  if (!order) return null;

  const customerName = (order as any).customerDoc?.name || 'Guest';
  const customerPhone = (order as any).customerDoc?.phone || 'N/A';

  const nextStatusMap: Record<string, string> = {
    'Pending': 'Confirmed',
    'Confirmed': 'Preparing',
    'Preparing': 'Ready',
    'Ready': 'Completed',
  };
  const nextStatus = nextStatusMap[order.status];

  const footer = (
    <div className="flex items-center justify-between gap-4 w-full">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-[#8C6E5A]">Status:</span>
        <StatusBadge status={order.status} />
      </div>

      <div className="flex gap-2">
        {order.status !== 'Cancelled' && order.status !== 'Completed' && (
          <Button
            variant="danger"
            onClick={() => updateStatus({ id: order._id as string, status: 'Cancelled', remarks: 'Cancelled by Admin' })}
            disabled={isUpdating}
          >
            Cancel
          </Button>
        )}

        {nextStatus && (
          <Button
            variant="primary"
            onClick={() => updateStatus({ id: order._id as string, status: nextStatus, remarks: `Marked as ${nextStatus} by Admin` })}
            disabled={isUpdating}
            isLoading={isUpdating}
          >
            Mark {nextStatus}
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={!!order}
      onClose={onClose}
      title={order.orderNumber}
      description={new Date(order.createdAt).toLocaleString()}
      size="lg"
      footer={footer}
    >
      <div className="space-y-8">
        {/* Customer Info */}
        <section>
          <h3 className="text-xs font-bold text-[#8C6E5A] uppercase tracking-wider mb-3">Customer</h3>
          <div className="bg-[#FFFBF5] rounded-xl p-4 border border-[#F0E6D8]">
            <div className="font-semibold text-[#1A1208]">{customerName}</div>
            <div className="text-sm text-[#4A3728] mt-1">📞 {customerPhone}</div>
          </div>
        </section>

        {/* Items */}
        <section>
          <h3 className="text-xs font-bold text-[#8C6E5A] uppercase tracking-wider mb-3">Order Items</h3>
          <div className="space-y-3">
            {order.items.map((item: IOrderItem, i: number) => (
              <div key={i} className="flex justify-between items-start text-sm">
                <div>
                  <div className="font-semibold text-[#1A1208]">{item.quantity}x {item.foodName}</div>
                  <div className="text-[#8C6E5A] text-xs mt-0.5">{item.variantName}</div>
                </div>
                <div className="font-semibold text-[#1A1208]">₹{item.totalPrice}</div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-[#F0E6D8] space-y-2 text-sm">
            <div className="flex justify-between text-[#4A3728]">
              <span>Subtotal</span>
              <span>₹{order.subtotal}</span>
            </div>
            <div className="flex justify-between text-[#4A3728]">
              <span>Tax</span>
              <span>₹{order.tax}</span>
            </div>
            <div className="flex justify-between font-bold text-[#1A1208] text-base mt-2 pt-2 border-t border-[#F0E6D8]">
              <span>Total</span>
              <span>₹{order.grandTotal}</span>
            </div>
          </div>
        </section>

        {/* Invoice Actions */}
        <section>
          <h3 className="text-xs font-bold text-[#8C6E5A] uppercase tracking-wider mb-3">Invoice & Documents</h3>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => window.open(`http://localhost:5000/api/v1/invoices/${order.orderNumber}/download`, '_blank')}
            >
              📄 Download PDF
            </Button>
            <Button
              variant="outline"
              onClick={async () => {
                try {
                  const res = await fetch(`http://localhost:5000/api/v1/invoices/${order.orderNumber}/send`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                  });
                  if (res.ok) alert('Invoice emailed to customer successfully.');
                  else alert('Failed to email invoice.');
                } catch (e) {
                  alert('Error sending invoice.');
                }
              }}
            >
              ✉️ Email Invoice
            </Button>
          </div>
        </section>

        {/* Timeline */}
        <section>
          <h3 className="text-xs font-bold text-[#8C6E5A] uppercase tracking-wider mb-4">Timeline</h3>
          {isTimelineLoading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-[#F0E6D8] rounded w-1/2"></div>
              <div className="h-4 bg-[#F0E6D8] rounded w-1/3"></div>
            </div>
          ) : timeline && timeline.length > 0 ? (
            <div className="relative border-l-2 border-[#F0E6D8] ml-3 space-y-6">
              {timeline.map((event) => (
                <div key={event._id} className="relative pl-6">
                  <div className="absolute w-3 h-3 bg-white border-2 border-[#E8441A] rounded-full -left-[7.5px] top-1.5"></div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[#1A1208] text-sm">{event.status}</span>
                    <span className="text-xs text-[#8C6E5A]">
                      {new Date(event.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {event.remarks && <p className="text-sm text-[#4A3728] mt-1">{event.remarks}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#8C6E5A]">No timeline events found.</p>
          )}
        </section>
      </div>
    </Modal>
  );
}

