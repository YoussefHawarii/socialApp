import { useState } from 'react';
import { useCurrentUser } from '@/features/user/useCurrentUser';
import { useChatHistory } from '@/features/chat/useChatHistory';
import { useChatSocket } from '@/features/chat/useChatSocket';
import { FriendSelector } from '@/features/chat/components/FriendSelector';
import { MessageList } from '@/features/chat/components/MessageList';
import { MessageComposer } from '@/features/chat/components/MessageComposer';
import { ConnectionStatusBadge } from '@/features/chat/components/ConnectionStatusBadge';
import { PageSpinner } from '@/components/shared/PageSpinner';
import { ApiErrorAlert } from '@/components/shared/ApiErrorAlert';
import { EmptyState } from '@/components/shared/EmptyState';
import type { User } from '@/types/user';

function Conversation({ friendId, friendName }: { friendId: string; friendName: string }) {
  const { data: me } = useCurrentUser();
  const { data: history, isLoading, error } = useChatHistory(friendId);
  const { liveMessages, status, sendMessage } = useChatSocket(friendId);

  if (!me) return null;

  const messages = [...(history ?? []), ...liveMessages];

  return (
    <div className="flex h-[28rem] flex-1 flex-col">
      <div className="flex items-center justify-between border-b border-gray-200 p-3">
        <h2 className="text-sm font-semibold text-gray-900">{friendName}</h2>
        <ConnectionStatusBadge status={status} />
      </div>
      {isLoading ? (
        <PageSpinner />
      ) : error ? (
        <div className="p-3">
          <ApiErrorAlert error={error} />
        </div>
      ) : (
        <MessageList messages={messages} myUserId={me._id} />
      )}
      <MessageComposer onSend={sendMessage} />
    </div>
  );
}

export function ChatPage() {
  const { data: user, isLoading, error } = useCurrentUser();
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);

  if (isLoading) return <PageSpinner />;
  if (error) return <ApiErrorAlert error={error} />;
  if (!user) return null;

  const friends = user.friends as User[];
  const selectedFriend = friends.find((f) => f._id === selectedFriendId);

  return (
    <div className="flex h-[32rem] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white sm:flex-row">
      <aside className="w-full shrink-0 overflow-y-auto border-b border-gray-200 p-3 sm:w-56 sm:border-r sm:border-b-0">
        <h2 className="mb-2 text-sm font-semibold text-gray-900">Friends</h2>
        <FriendSelector friends={friends} selectedFriendId={selectedFriendId} onSelect={setSelectedFriendId} />
      </aside>

      {selectedFriend ? (
        <Conversation friendId={selectedFriend._id} friendName={selectedFriend.userName} />
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <EmptyState title="Select a friend" description="Choose a conversation to start chatting." />
        </div>
      )}
    </div>
  );
}
