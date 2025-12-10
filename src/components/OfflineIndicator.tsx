import { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { syncQueueToServer } from '@/lib/offline';

export const OfflineIndicator = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [syncing, setSyncing] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            toast({ title: "Back Online", description: "You are connected to the internet." });
            handleSync();
        };
        const handleOffline = () => {
            setIsOnline(false);
            toast({ variant: "destructive", title: "Offline", description: "You are currently offline. Changes will be saved locally." });
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const handleSync = async () => {
        if (!navigator.onLine) return;
        setSyncing(true);
        try {
            await syncQueueToServer();
            toast({ title: "Sync Complete", description: "All offline data has been synced to the server." });
        } catch (e) {
            console.error("Sync failed", e);
        } finally {
            setSyncing(false);
        }
    };

    if (isOnline && !syncing) return null;

    return (
        <div className={cn(
            "fixed bottom-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full shadow-lg transition-all duration-300",
            isOnline ? "bg-green-500 text-white" : "bg-destructive text-destructive-foreground"
        )}>
            {isOnline ? (
                <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span className="text-sm font-medium">Syncing...</span>
                </>
            ) : (
                <>
                    <WifiOff className="w-4 h-4" />
                    <span className="text-sm font-medium">Offline Mode</span>
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-white hover:bg-white/20" onClick={handleSync}>
                        Retry
                    </Button>
                </>
            )}
        </div>
    );
};
