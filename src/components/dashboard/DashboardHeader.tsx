import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Search, Menu, X, Zap } from 'lucide-react';
import { mockLearner } from '@/data/mockData';

interface DashboardHeaderProps {
  onMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

export const DashboardHeader = ({ onMenuToggle, isMobileMenuOpen }: DashboardHeaderProps) => {
  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 lg:px-8">
        {/* Mobile menu button */}
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
        
        {/* Search */}
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
        
        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* XP Badge */}
          <Badge variant="accent" className="hidden sm:flex items-center gap-1">
            <Zap className="w-3 h-3" />
            {mockLearner.totalXp.toLocaleString()} XP
          </Badge>
          
          {/* Notifications */}
          <Button variant="ghost" size="icon-sm" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
          </Button>
          
          {/* User avatar */}
          <button className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
            {mockLearner.name.charAt(0)}
          </button>
        </div>
      </div>
    </header>
  );
};
