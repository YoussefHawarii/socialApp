import { useAcceptFriendRequest } from '@/features/friends/useFriendMutations';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/shared/EmptyState';
import { ApiErrorAlert } from '@/components/shared/ApiErrorAlert';
import { toast } from '@/store/toast.store';
import type { User } from '@/types/user';

// The backend does not populate `friendRequests`, so each entry is a raw user id.
export function IncomingRequestsList({ friendRequests }: { friendRequests: User[] | string[] }) {
  const acceptRequest = useAcceptFriendRequest();
  const ids = friendRequests.map((f) => (typeof f === 'string' ? f : f._id));

  if (ids.length === 0) {
    return <EmptyState title="No pending requests" description="Incoming friend requests will appear here." />;
  }

  return (
    <div className="flex flex-col gap-2">
      {acceptRequest.isError && <ApiErrorAlert error={acceptRequest.error} />}
      <ul className="flex flex-col gap-2">
        {ids.map((id) => {
          const isThisPending = acceptRequest.isPending && acceptRequest.variables === id;
          return (
            <li
              key={id}
              className="flex items-center justify-between gap-2 rounded-lg border border-gray-200 p-2"
            >
              <span className="truncate text-sm text-gray-700" title={id}>
                {id}
              </span>
              <Button
                variant="secondary"
                isLoading={isThisPending}
                disabled={acceptRequest.isPending}
                onClick={() =>
                  acceptRequest.mutate(id, { onSuccess: () => toast.success('Friend request accepted') })
                }
              >
                Accept
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
