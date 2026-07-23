'use client';

import * as React from 'react';
import { DashboardClient } from '../../../features/admin';
import { AdminLayout } from '../../../features/admin';
import { AuthGuard } from '../../../components/shared/AuthGuard';

export default function AdminDashboardPage() {
  return (
    <AuthGuard>
      <AdminLayout>
        <DashboardClient />
      </AdminLayout>
    </AuthGuard>
  );
}
