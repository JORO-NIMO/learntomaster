import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '@/lib/auth';

interface Props {
  children: React.ReactElement;
}

const AuthRoute: React.FC<Props> = ({ children }) => {
  const user = getCurrentUser();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

export default AuthRoute;
