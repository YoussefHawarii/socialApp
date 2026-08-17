import { useState } from 'react';
import { useSendFriendRequest } from '@/features/friends/useFriendMutations';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ApiErrorAlert } from '@/components/shared/ApiErrorAlert';
import { toast } from '@/store/toast.store';

export function SendFriendRequestForm() {
  const [friendId, setFriendId] = useState('');
  const sendRequest = useSendFriendRequest();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendId.trim()) return;
    sendRequest.mutate(friendId.trim(), {
      onSuccess: () => {
        toast.success('Friend request sent');
        setFriendId('');
      },
    });
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2">
      <h3 className="text-sm font-semibold text-gray-900">Send a friend request</h3>
      {sendRequest.isError && <ApiErrorAlert error={sendRequest.error} />}
      <div className="flex gap-2">
        <Input
          placeholder="User ID"
          value={friendId}
          onChange={(e) => setFriendId(e.target.value)}
          aria-label="Friend user ID"
        />
        <Button type="submit" isLoading={sendRequest.isPending} disabled={!friendId.trim()}>
          Send
        </Button>
      </div>
    </form>
  );
}
