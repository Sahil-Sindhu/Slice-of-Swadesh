import { OrdersClient } from '../../../features/admin/orders/OrdersClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Orders | SOS Admin',
  description: 'Manage restaurant orders',
};

export default function AdminOrdersPage() {
  return <OrdersClient />;
}
