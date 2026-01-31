import { useAppSelector } from '../../hooks/hooks';
import type { RootState } from '../../redux/store';
import { PERMISSION_TYPE } from '../../features/auth/auth.interface';
import { hasPermission } from '../layout/menu-items-data';
import UnauthorizedPage from '../../features/auth/pages/UnauthorizedPage';

interface PermissionRouteProps {
  children: React.ReactNode;
  permissions: PERMISSION_TYPE[];
}

const PermissionRoute = ({ children, permissions }: PermissionRouteProps) => {
  const userPermissions = useAppSelector((state: RootState) => state.auth.data?.permission);

  if (!hasPermission(permissions, userPermissions)) {
    return <UnauthorizedPage />;
  }

  return <>{children}</>;
};

export default PermissionRoute;
