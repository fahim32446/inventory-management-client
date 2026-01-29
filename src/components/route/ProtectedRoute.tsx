import { Navigate } from 'react-router-dom';

import type { RootState } from '../../redux/store';
import { useAppSelector } from '../../hooks/hooks';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { data, accessToken } = useAppSelector((state: RootState) => state.auth);

  const isAuthenticated = !!accessToken && !!data;

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
