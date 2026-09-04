import type { FriendSummary } from '@/types/user';
import { EmptyState } from '@/components/shared/EmptyState';

interface FriendSelectorProps {
  friends: FriendSummary[];
  selectedFriendId: string | null;
  onSelect: (friendId: string) => void;
}

export function FriendSelector({ friends, selectedFriendId, onSelect }: FriendSelectorProps) {
  if (friends.length === 0) {
    return <EmptyState title="No friends yet" description="Add friends to start chatting." />;
  }

  return (
    <ul className="flex flex-col gap-1">
      {friends.map((friend) => (
        <li key={friend._id}>
          <button
            type="button"
            onClick={() => onSelect(friend._id)}
            className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
              selectedFriendId === friend._id ? 'bg-brand-50 text-brand-700' : 'hover:bg-gray-100'
            }`}
          >
            <img
              src={friend.profilePicture?.secure_url}
              alt=""
              className="h-8 w-8 rounded-full object-cover"
            />
            {friend.userName}
          </button>
        </li>
      ))}
    </ul>
  );
}
