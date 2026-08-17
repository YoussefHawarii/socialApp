import { NavLink, Outlet } from 'react-router-dom';
import { useLogout } from '@/features/auth/useAuth';
import { useCurrentUser } from '@/features/user/useCurrentUser';
import { useSocketConnection } from '@/features/chat/useSocketConnection';
import { Button } from '@/components/ui/Button';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    isActive ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:bg-gray-100'
  }`;

export function AppLayout() {
  const logout = useLogout();
  const { data: user } = useCurrentUser();
  useSocketConnection();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <nav aria-label="Primary" className="flex flex-wrap items-center gap-1">
            <NavLink to="/" className={navLinkClass} end>
              Feed
            </NavLink>
            <NavLink to="/profile" className={navLinkClass}>
              Profile
            </NavLink>
            <NavLink to="/friends" className={navLinkClass}>
              Friends
            </NavLink>
            <NavLink to="/chat" className={navLinkClass}>
              Chat
            </NavLink>
            {(user?.role === 'admin' || user?.role === 'superAdmin') && (
              <NavLink to="/admin" className={navLinkClass}>
                Admin
              </NavLink>
            )}
          </nav>
          <div className="flex items-center gap-3">
            {user && <span className="text-sm text-gray-600">{user.userName}</span>}
            <Button variant="secondary" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
