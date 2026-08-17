import { useEffect, useRef } from 'react';
import type { ChatMessage } from '@/types/chat';
import { EmptyState } from '@/components/shared/EmptyState';

export function MessageList({ messages, myUserId }: { messages: ChatMessage[]; myUserId: string }) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  if (messages.length === 0) {
    return <EmptyState title="No messages yet" description="Say hello to start the conversation." />;
  }

  return (
    <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-3">
      {messages.map((msg) => {
        const isMine = msg.sender === myUserId;
        return (
          <div key={msg._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xs rounded-2xl px-3 py-2 text-sm ${
                isMine ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-900'
              }`}
            >
              {msg.content}
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
