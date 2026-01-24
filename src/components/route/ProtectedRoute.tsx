import { Navigate } from 'react-router-dom';

import type { RootState } from '../../redux/store';
import { useAppSelector } from '../../hooks/hooks';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { data } = useAppSelector((state: RootState) => state.auth);

  // Check if user is authenticated
  const isAuthenticated = !!data?.accessToken && !!data;

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to='/login' replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
