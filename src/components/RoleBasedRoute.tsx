import { Navigate, useLocation } from 'react-router-dom';
import { UserRole } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import { useServerRoleVerification } from '@/hooks/useServerRoleVerification';
import { Loader2 } from 'lucide-react';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

const RoleBasedRoute = ({ children, allowedRoles }: RoleBasedRouteProps) => {
  const location = useLocation();
  const { toast } = useToast();
  const { verified, userRoles, isLoading, error } = useServerRoleVerification(allowedRoles);

  useEffect(() => {
    if (!isLoading && !verified && !error) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: `You need to be a ${allowedRoles.join(' or ')} to access this page.`,
      });
    }
  }, [isLoading, verified, error, allowedRoles, toast]);

  // Show loading state while verifying
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Verifying access...</span>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (error === 'Not authenticated') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role not verified - redirect based on actual role
  if (!verified) {
    // Redirect to appropriate dashboard based on actual server-verified role
    if (userRoles.includes('teacher')) return <Navigate to="/teacher" replace />;
    if (userRoles.includes('student')) return <Navigate to="/dashboard" replace />;
    if (userRoles.includes('admin') || userRoles.includes('school_admin')) return <Navigate to="/admin" replace />;
    
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default RoleBasedRoute;
