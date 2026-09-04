import {
  useAcceptFriendRequest,
  useDeclineFriendRequest,
} from '@/features/friends/useFriendMutations';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/shared/EmptyState';
import { ApiErrorAlert } from '@/components/shared/ApiErrorAlert';
import { toast } from '@/store/toast.store';
import type { FriendSummary } from '@/types/user';

export function IncomingRequestsList({ requests }: { requests: FriendSummary[] }) {
  const acceptRequest = useAcceptFriendRequest();
  const declineRequest = useDeclineFriendRequest();

  if (requests.length === 0) {
    return (
      <EmptyState
        title="No pending requests"
        description="Incoming friend requests will appear here."
      />
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {acceptRequest.isError && <ApiErrorAlert error={acceptRequest.error} />}
      {declineRequest.isError && <ApiErrorAlert error={declineRequest.error} />}
      <ul className="flex flex-col gap-2">
        {requests.map((requester) => {
          const isThisPending =
            (acceptRequest.isPending && acceptRequest.variables === requester._id) ||
            (declineRequest.isPending && declineRequest.variables === requester._id);
          return (
            <li
              key={requester._id}
              className="flex items-center justify-between gap-2 rounded-lg border border-gray-200 p-2"
            >
              <div className="flex items-center gap-2">
                <img
                  src={requester.profilePicture?.secure_url}
                  alt=""
                  className="h-8 w-8 rounded-full object-cover"
                />
                <span className="text-sm text-gray-800">{requester.userName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  isLoading={acceptRequest.isPending && acceptRequest.variables === requester._id}
                  disabled={isThisPending}
                  onClick={() =>
                    acceptRequest.mutate(requester._id, {
                      onSuccess: () => toast.success('Friend request accepted'),
                    })
                  }
                >
                  Accept
                </Button>
                <Button
                  variant="ghost"
                  isLoading={declineRequest.isPending && declineRequest.variables === requester._id}
                  disabled={isThisPending}
                  onClick={() =>
                    declineRequest.mutate(requester._id, {
                      onSuccess: () => toast.success('Friend request declined'),
                    })
                  }
                >
                  Decline
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
