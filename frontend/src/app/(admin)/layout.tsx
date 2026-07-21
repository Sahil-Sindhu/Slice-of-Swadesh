import { AdminLayout } from '../../features/admin';
import { AuthGuard } from '../../components/shared/AuthGuard';

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Assuming AuthGuard supports requiredRole check eventually.
    // For Sprint O1, we'll just require them to be logged in and maybe check role inside the component later.
    // The user told us we'll handle permissions strictly in a later sprint.
    <AuthGuard>
      <AdminLayout>
        {children}
      </AdminLayout>
    </AuthGuard>
  );
}
