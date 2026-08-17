import { useCurrentUser } from '@/features/user/useCurrentUser';
import { PageSpinner } from '@/components/shared/PageSpinner';
import { ApiErrorAlert } from '@/components/shared/ApiErrorAlert';
import { ProfilePictureUploader } from '@/features/user/components/ProfilePictureUploader';
import { EditProfileForm } from '@/features/user/components/EditProfileForm';
import { ChangePasswordForm } from '@/features/user/components/ChangePasswordForm';
import { UpdateEmailForm } from '@/features/user/components/UpdateEmailForm';
import { DeactivateAccountSection } from '@/features/user/components/DeactivateAccountSection';
import { FriendsSummary } from '@/features/user/components/FriendsSummary';

export function ProfilePage() {
  const { data: user, isLoading, error } = useCurrentUser();

  if (isLoading) return <PageSpinner />;
  if (error) return <ApiErrorAlert error={error} />;
  if (!user) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <ProfilePictureUploader user={user} />
          <div className="flex flex-1 flex-col gap-1 text-center sm:text-left">
            <h1 className="text-xl font-semibold text-gray-900">{user.userName}</h1>
            <p className="text-sm text-gray-500">{user.email}</p>
            <span className="mt-1 inline-flex w-fit self-center rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700 sm:self-start">
              {user.role}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <FriendsSummary user={user} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <EditProfileForm user={user} />
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <ChangePasswordForm />
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <UpdateEmailForm />
        </div>
        <DeactivateAccountSection />
      </div>
    </div>
  );
}
