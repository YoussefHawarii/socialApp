import { Routes, Route } from 'react-router-dom';
import { AuthLayout } from '@/components/shared/AuthLayout';
import { AppLayout } from '@/components/shared/AppLayout';
import { ProtectedRoute } from './routing/ProtectedRoute';
import { PublicOnlyRoute } from './routing/PublicOnlyRoute';
import { RoleGuard } from './routing/RoleGuard';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { ForgetPasswordPage } from '@/pages/auth/ForgetPasswordPage';
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage';
import { ActivateAccountPage } from '@/pages/auth/ActivateAccountPage';
import { VerifyEmailTokenPage } from '@/pages/profile/VerifyEmailTokenPage';
import { ProfilePage } from '@/pages/profile/ProfilePage';
import { FeedPage } from '@/pages/posts/FeedPage';
import { PostDetailsPage } from '@/pages/posts/PostDetailsPage';
import { EditPostPage } from '@/pages/posts/EditPostPage';
import { FriendsPage } from '@/pages/friends/FriendsPage';
import { ChatPage } from '@/pages/chat/ChatPage';
import { AdminPage } from '@/pages/admin/AdminPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forget-password" element={<ForgetPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/activate-account/:token" element={<ActivateAccountPage />} />
        <Route path="/verify-email/:token" element={<VerifyEmailTokenPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<FeedPage />} />
          <Route path="/posts/:id" element={<PostDetailsPage />} />
          <Route path="/posts/:id/edit" element={<EditPostPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/friends" element={<FriendsPage />} />
          <Route path="/chat" element={<ChatPage />} />

          <Route element={<RoleGuard allow={['admin', 'superAdmin']} />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
