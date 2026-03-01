import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Search, Menu, X, Zap, RefreshCcw } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { syncQueueToServer } from '@/lib/offline';
import { getCurrentUser } from '@/lib/auth';
import { dashboardService } from '@/lib/dashboardService';

interface DashboardHeaderProps {
  onMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

const SERVER_BASE = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

export const DashboardHeader = ({ onMenuToggle, isMobileMenuOpen }: DashboardHeaderProps) => {
  const [syncing, setSyncing] = useState(false);
  const [totalXp, setTotalXp] = useState(0);
  const user = getCurrentUser();

  useEffect(() => {
    dashboardService.getStats().then((stats) => setTotalXp(stats.totalXp)).catch(() => setTotalXp(0));
  }, []);

  const doSync = async () => {
    if (syncing) return;
    setSyncing(true);
    try {
      const res = await syncQueueToServer(SERVER_BASE);
      toast({ title: 'Sync complete', description: `Uploaded ${res.uploaded ?? 0} item(s)` });
    } catch (e: any) {
      toast({ title: 'Sync failed', description: e?.message ?? 'Error during sync', variant: 'destructive' });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 lg:px-8">
        <button
          className="lg:hidden p-2 -ml-2"
          onClick={onMenuToggle}
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 text-foreground" />
          ) : (
            <Menu className="w-6 h-6 text-foreground" />
          )}
        </button>

        <div className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search lessons, topics..."
              className="w-full h-10 pl-10 pr-4 rounded-lg bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={doSync} disabled={syncing}>
            <RefreshCcw className="w-4 h-4 mr-2" />
            {syncing ? 'Syncing...' : 'Sync now'}
          </Button>
          <Badge variant="accent" className="hidden sm:flex items-center gap-1">
            <Zap className="w-3 h-3" />
            {totalXp.toLocaleString()} XP
          </Badge>

          <Button variant="ghost" size="icon-sm" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
          </Button>

          <button className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
            {(user?.name?.charAt(0) || user?.email?.charAt(0) || 'U').toUpperCase()}
          </button>
        </div>
      </div>
    </header>
  );
};
