import {
  useAcceptFriendRequest,
  useCancelFriendRequest,
  useDeclineFriendRequest,
  useSendFriendRequest,
} from '@/features/friends/useFriendMutations';
import { Button } from '@/components/ui/Button';
import { toast } from '@/store/toast.store';
import type { SearchResultUser } from '@/types/user';

export function SearchResultRow({ result }: { result: SearchResultUser }) {
  const sendRequest = useSendFriendRequest();
  const cancelRequest = useCancelFriendRequest();
  const acceptRequest = useAcceptFriendRequest();
  const declineRequest = useDeclineFriendRequest();

  const isPending =
    sendRequest.isPending ||
    cancelRequest.isPending ||
    acceptRequest.isPending ||
    declineRequest.isPending;

  return (
    <li className="flex items-center justify-between gap-2 rounded-lg border border-gray-200 p-2">
      <div className="flex items-center gap-2">
        <img
          src={result.profilePicture?.secure_url}
          alt=""
          className="h-8 w-8 rounded-full object-cover"
        />
        <span className="text-sm text-gray-800">{result.userName}</span>
      </div>

      {result.status === 'friends' && (
        <span className="text-xs font-medium text-gray-500">Friends</span>
      )}

      {result.status === 'not_friends' && (
        <Button
          variant="secondary"
          isLoading={sendRequest.isPending}
          disabled={isPending}
          onClick={() =>
            sendRequest.mutate(result._id, {
              onSuccess: () => toast.success('Friend request sent'),
            })
          }
        >
          Add Friend
        </Button>
      )}

      {result.status === 'pending_sent' && (
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-500">Pending</span>
          <Button
            variant="ghost"
            isLoading={cancelRequest.isPending}
            disabled={isPending}
            onClick={() =>
              cancelRequest.mutate(result._id, {
                onSuccess: () => toast.success('Friend request canceled'),
              })
            }
          >
            Cancel
          </Button>
        </div>
      )}

      {result.status === 'pending_received' && (
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            isLoading={acceptRequest.isPending}
            disabled={isPending}
            onClick={() =>
              acceptRequest.mutate(result._id, {
                onSuccess: () => toast.success('Friend request accepted'),
              })
            }
          >
            Accept
          </Button>
          <Button
            variant="ghost"
            isLoading={declineRequest.isPending}
            disabled={isPending}
            onClick={() =>
              declineRequest.mutate(result._id, {
                onSuccess: () => toast.success('Friend request declined'),
              })
            }
          >
            Decline
          </Button>
        </div>
      )}
    </li>
  );
}
