import { useState } from 'react';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

import { OfflineIndicator } from '@/components/OfflineIndicator';
import { Button } from '@/components/ui/button'; // Assuming Button and Menu are needed for the new layout
import { Menu } from 'lucide-react'; // Assuming Menu icon is needed
import { UserNav } from '@/components/dashboard/UserNav'; // Assuming UserNav is needed
import { AppSidebar } from '@/components/dashboard/AppSidebar'; // Assuming AppSidebar replaces DashboardSidebar

export const DashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-card border-r transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:h-screen",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <AppSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-72 transition-all duration-200 ease-in-out">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>

          <div className="flex-1" />

          <UserNav />
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-6xl animate-fade-in">
            {children}
          </div>
        </main>
      </div>

      <OfflineIndicator />
    </div>
  );
};
