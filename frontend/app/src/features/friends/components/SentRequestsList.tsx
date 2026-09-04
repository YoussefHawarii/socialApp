import { useCancelFriendRequest } from '@/features/friends/useFriendMutations';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/shared/EmptyState';
import { ApiErrorAlert } from '@/components/shared/ApiErrorAlert';
import { toast } from '@/store/toast.store';
import type { FriendSummary } from '@/types/user';

export function SentRequestsList({ requests }: { requests: FriendSummary[] }) {
  const cancelRequest = useCancelFriendRequest();

  if (requests.length === 0) {
    return (
      <EmptyState
        title="No pending requests"
        description="Requests you've sent will appear here."
      />
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {cancelRequest.isError && <ApiErrorAlert error={cancelRequest.error} />}
      <ul className="flex flex-col gap-2">
        {requests.map((recipient) => (
          <li
            key={recipient._id}
            className="flex items-center justify-between gap-2 rounded-lg border border-gray-200 p-2"
          >
            <div className="flex items-center gap-2">
              <img
                src={recipient.profilePicture?.secure_url}
                alt=""
                className="h-8 w-8 rounded-full object-cover"
              />
              <span className="text-sm text-gray-800">{recipient.userName}</span>
            </div>
            <Button
              variant="ghost"
              isLoading={cancelRequest.isPending && cancelRequest.variables === recipient._id}
              disabled={cancelRequest.isPending}
              onClick={() =>
                cancelRequest.mutate(recipient._id, {
                  onSuccess: () => toast.success('Friend request canceled'),
                })
              }
            >
              Cancel
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
