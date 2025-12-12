import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  BookOpen,
  LayoutDashboard,
  Library,
  Trophy,
  BarChart3,
  Settings,
  Download,
  HelpCircle,
  LogOut,
  Flame,
  Brain,
  Compass
} from 'lucide-react';
import { mockLearner } from '@/data/mockData';
import { Progress } from '@/components/ui/progress';

const sidebarLinks = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'AI Study Hub', href: '/dashboard/study-hub', icon: Brain },
  { name: 'Career Compass', href: '/dashboard/career', icon: Compass },
  { name: 'My Subjects', href: '/dashboard/subjects', icon: Library },
  { name: 'Achievements', href: '/dashboard/achievements', icon: Trophy },
  { name: 'Progress', href: '/analytics', icon: BarChart3 },
];

const bottomLinks = [
  { name: 'Profile', href: '/dashboard/profile', icon: HelpCircle },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  { name: 'Help', href: '/help', icon: HelpCircle },
];

import { logout } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';

export const DashboardSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-sidebar text-sidebar-foreground min-h-screen fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-sidebar-primary flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          <span className="font-display font-bold text-lg text-sidebar-foreground">
            Learn2Master
          </span>
        </Link>
      </div>

      {/* User profile summary */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-sidebar-primary/20 flex items-center justify-center text-sidebar-primary font-semibold">
            {mockLearner.name.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-sm text-sidebar-foreground">{mockLearner.name}</p>
            <p className="text-xs text-sidebar-foreground/60">{mockLearner.grade} • {mockLearner.stream}</p>
          </div>
        </div>

        {/* Streak */}
        <div className="flex items-center gap-2 mb-3 p-2 rounded-lg bg-sidebar-accent">
          <Flame className="w-4 h-4 text-accent" />
          <span className="text-xs font-medium text-sidebar-foreground">{mockLearner.streak} day streak!</span>
        </div>

        {/* Overall progress */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-sidebar-foreground/60">Overall Mastery</span>
            <span className="font-medium text-sidebar-foreground">{mockLearner.overallMastery}%</span>
          </div>
          <Progress value={mockLearner.overallMastery} size="sm" />
        </div>
      </div>

      {/* Main navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.href;

          return (
            <Link
              key={link.name}
              to={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom navigation */}
      <div className="p-4 border-t border-sidebar-border space-y-1">
        {bottomLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              to={link.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
            >
              <Icon className="w-5 h-5" />
              {link.name}
            </Link>
          );
        })}
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </button>
      </div>
    </aside>
  );
};
