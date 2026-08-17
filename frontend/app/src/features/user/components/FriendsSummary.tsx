import type { User } from '@/types/user';
import { EmptyState } from '@/components/shared/EmptyState';

/** Read-only friends summary for the profile page. Send/accept actions ship in Phase 7. */
export function FriendsSummary({ user }: { user: User }) {
  const friends = user.friends as User[];

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-gray-900">Friends ({friends.length})</h3>
      {friends.length === 0 ? (
        <EmptyState title="No friends yet" description="Friend requests will appear here once accepted." />
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
      {user.friendRequests.length > 0 && (
        <p className="text-xs text-gray-500">
          You have {user.friendRequests.length} pending friend request(s). Manage them on the{' '}
          <a href="/friends" className="text-brand-600 hover:underline">
            Friends
          </a>{' '}
          page.
        </p>
      )}
    </div>
  );
}
