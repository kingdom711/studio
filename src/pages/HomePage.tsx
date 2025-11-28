import { useAuth } from '@/providers/auth-provider';
import LoginPage from '@/components/auth/login-page';
import DashboardPage from '@/components/dashboard/dashboard-page';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return user ? <DashboardPage /> : <LoginPage />;
}

