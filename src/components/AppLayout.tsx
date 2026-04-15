import { useAuth } from '@/context/AuthContext';
import { BrandProvider } from '@/context/BrandContext';
import { ActivityLogProvider } from '@/context/ActivityLogContext';
import { TopNav } from '@/components/TopNav';
import { Outlet, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

function AuthGate() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: '/login' });
    }
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <BrandProvider>
      <ActivityLogProvider>
        <div className="min-h-screen flex flex-col w-full pb-14 md:pb-0">
          <TopNav />
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </ActivityLogProvider>
    </BrandProvider>
  );
}

export function AppLayout() {
  return <AuthGate />;
}
