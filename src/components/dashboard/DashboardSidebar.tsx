import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  BookOpen,
  LayoutDashboard,
  Library,
  Trophy,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  Flame,
  Brain,
  Compass,
  GraduationCap,
  Users,
  Shield,
  PenTool
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { getCurrentUser, logout, UserRole } from '@/lib/auth';
import { useEffect, useState } from 'react';
import { dashboardService, DashboardStats } from '@/lib/dashboardService';

const studentLinks = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'AI Study Hub', href: '/dashboard/study-hub', icon: Brain },
  { name: 'Career Compass', href: '/dashboard/career', icon: Compass },
  { name: 'My Subjects', href: '/dashboard/subjects', icon: Library },
  { name: 'Achievements', href: '/dashboard/achievements', icon: Trophy },
  { name: 'Progress', href: '/dashboard/analytics', icon: BarChart3 },
];

const teacherLinks = [
  { name: 'Dashboard', href: '/teacher', icon: LayoutDashboard },
  { name: 'Authoring Tool', href: '/authoring', icon: PenTool },
  { name: 'Profile', href: '/dashboard/profile', icon: Users },
  { name: 'Classes', href: '/teacher', icon: GraduationCap },
];

const adminLinks = [
  { name: 'Admin Panel', href: '/admin', icon: Shield },
  { name: 'Users', href: '/admin', icon: Users },
  { name: 'Content', href: '/authoring', icon: Library },
];

const bottomLinks = [
  { name: 'Profile', href: '/dashboard/profile', icon: HelpCircle },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  { name: 'Help', href: '/help', icon: HelpCircle },
];

export const DashboardSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());
  const [stats, setStats] = useState<DashboardStats>({
    streak: 0,
    totalXp: 0,
    lessonsDone: 0,
    quizzesPassed: 0,
    overallMastery: 0,
    dailyGoalMinutes: 45,
  });

  useEffect(() => {
    const u = getCurrentUser();
    setUser(u);
    dashboardService.getStats().then(setStats).catch(() => undefined);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getLinks = (role: UserRole) => {
    switch (role) {
      case 'teacher':
        return teacherLinks;
      case 'admin':
      case 'school_admin':
        return adminLinks;
      default:
        return studentLinks;
    }
  };

  const currentLinks = user ? getLinks(user.role) : studentLinks;
  const isStudent = user?.role === 'student' || !user?.role;
  const fallbackName = user?.email?.split('@')[0] || 'User';
  const displayName = user?.name || fallbackName;

  return (
    <aside className="flex flex-col w-full h-full bg-sidebar text-sidebar-foreground">
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

      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-sidebar-primary/20 flex items-center justify-center text-sidebar-primary font-semibold">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="font-medium text-sm text-sidebar-foreground truncate">{displayName}</p>
            <p className="text-xs text-sidebar-foreground/60 capitalize">{user?.role || 'Student'}</p>
          </div>
        </div>

        {isStudent && (
          <>
            <div className="flex items-center gap-2 mb-3 p-2 rounded-lg bg-sidebar-accent">
              <Flame className="w-4 h-4 text-accent" />
              <span className="text-xs font-medium text-sidebar-foreground">{stats.streak} day streak!</span>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-sidebar-foreground/60">Overall Mastery</span>
                <span className="font-medium text-sidebar-foreground">{stats.overallMastery}%</span>
              </div>
              <Progress value={stats.overallMastery} size="sm" />
            </div>
          </>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {currentLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.href;

          return (
            <Link
              key={link.name}
              to={link.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
              )}
            >
              <Icon className="w-5 h-5" />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border space-y-1">
        {bottomLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.href;
          return (
            <Link
              key={link.name}
              to={link.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                isActive
                  ? 'bg-sidebar-primary/10 text-sidebar-primary font-medium'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
              )}
            >
              <Icon className="w-5 h-5" />
              {link.name}
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-red-500 hover:bg-red-50 transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </button>
      </div>
    </aside>
  );
};
