import { Navigate, useLocation } from 'react-router-dom';
import type { RootState } from '../../redux/store';
import { useAppSelector } from '../../hooks/hooks';

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const { data, accessToken } = useAppSelector((state: RootState) => state.auth);

  const isAuthenticated = !!accessToken && !!data;

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
