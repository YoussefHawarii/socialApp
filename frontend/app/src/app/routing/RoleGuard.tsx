import { Navigate, Outlet } from 'react-router-dom';
import { useCurrentUser } from '@/features/user/useCurrentUser';
import { PageSpinner } from '@/components/shared/PageSpinner';
import type { Role } from '@/lib/constants';

interface RoleGuardProps {
  allow: Role[];
}

export function RoleGuard({ allow }: RoleGuardProps) {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) return <PageSpinner />;
  if (!user || !allow.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
