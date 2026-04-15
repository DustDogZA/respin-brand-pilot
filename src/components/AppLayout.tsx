import { BrandProvider } from '@/context/BrandContext';
import { ActivityLogProvider } from '@/context/ActivityLogContext';
import { TopNav } from '@/components/TopNav';
import { Outlet } from '@tanstack/react-router';

export function AppLayout() {
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
