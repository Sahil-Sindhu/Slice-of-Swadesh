import { DashboardClient } from '../../../features/admin';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | SOS Admin',
  description: 'Restaurant operations dashboard',
};

export default function AdminDashboardPage() {
  return <DashboardClient />;
}
