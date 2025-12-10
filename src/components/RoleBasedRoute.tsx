import { Navigate, useLocation } from 'react-router-dom';
import { getCurrentUser, UserRole } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

interface RoleBasedRouteProps {
    children: React.ReactNode;
    allowedRoles: UserRole[];
}

const RoleBasedRoute = ({ children, allowedRoles }: RoleBasedRouteProps) => {
    const user = getCurrentUser();
    const location = useLocation();
    const { toast } = useToast();

    useEffect(() => {
        if (user && !allowedRoles.includes(user.role)) {
            toast({
                variant: "destructive",
                title: "Access Denied",
                description: `You need to be a ${allowedRoles.join(' or ')} to access this page.`,
            });
        }
    }, [user, allowedRoles, toast]);

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        // Redirect to appropriate dashboard based on actual role
        if (user.role === 'teacher') return <Navigate to="/teacher" replace />;
        if (user.role === 'student') return <Navigate to="/dashboard" replace />;
        if (user.role === 'admin' || user.role === 'school_admin') return <Navigate to="/admin" replace />;

        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default RoleBasedRoute;
