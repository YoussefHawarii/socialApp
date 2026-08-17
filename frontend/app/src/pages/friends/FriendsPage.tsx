import { useCurrentUser } from '@/features/user/useCurrentUser';
import { PageSpinner } from '@/components/shared/PageSpinner';
import { ApiErrorAlert } from '@/components/shared/ApiErrorAlert';
import { EmptyState } from '@/components/shared/EmptyState';
import { SendFriendRequestForm } from '@/features/friends/components/SendFriendRequestForm';
import { IncomingRequestsList } from '@/features/friends/components/IncomingRequestsList';
import type { User } from '@/types/user';

export function FriendsPage() {
  const { data: user, isLoading, error } = useCurrentUser();

  if (isLoading) return <PageSpinner />;
  if (error) return <ApiErrorAlert error={error} />;
  if (!user) return null;

  const friends = user.friends as User[];

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <SendFriendRequestForm />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-3 text-sm font-semibold text-gray-900">
          Incoming requests ({user.friendRequests.length})
        </h2>
        <IncomingRequestsList friendRequests={user.friendRequests} />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-3 text-sm font-semibold text-gray-900">Friends ({friends.length})</h2>
        {friends.length === 0 ? (
          <EmptyState title="No friends yet" description="Accepted friend requests will show up here." />
        ) : (
          <ul className="flex flex-col gap-2">
            {friends.map((friend) => (
              <li key={friend._id} className="flex items-center gap-2 rounded-lg border border-gray-200 p-2">
                <img
                  src={friend.profilePicture?.secure_url}
                  alt=""
                  className="h-8 w-8 rounded-full object-cover"
                />
                <span className="text-sm text-gray-800">{friend.userName}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
