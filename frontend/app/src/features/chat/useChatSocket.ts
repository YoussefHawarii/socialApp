import { useCallback, useEffect, useRef, useState } from 'react';
import { connectSocket, getSocket } from '@/services/socket';
import type { ChatMessage, SuccessMessageEvent } from '@/types/chat';
import { useCurrentUser } from '@/features/user/useCurrentUser';
import { useAuthStore } from '@/store/auth.store';

export type SocketStatus = 'connected' | 'disconnected' | 'reconnecting';

/**
 * Owns the realtime side of a single conversation: listens for messages from
 * `friendId` and exposes a `sendMessage` emitter. History (REST) lives outside this hook.
 */
export function useChatSocket(friendId: string) {
  const { data: me } = useCurrentUser();
  const accessToken = useAuthStore((s) => s.accessToken);
  const [liveMessages, setLiveMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<SocketStatus>(getSocket()?.connected ? 'connected' : 'disconnected');
  const messageIdCounter = useRef(0);

  // Reset accumulated live messages when switching conversations (adjusting state during
  // render, per https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes).
  const [prevFriendId, setPrevFriendId] = useState(friendId);
  if (prevFriendId !== friendId) {
    setPrevFriendId(friendId);
    setLiveMessages([]);
  }

  useEffect(() => {
    if (!accessToken) return;
    // Idempotent: reuses the existing connection from useSocketConnection (AppLayout) when
    // present, or creates one here if this effect happens to run first (child-before-parent
    // effect ordering on the very first mount of AppLayout + ChatPage together).
    const socket = connectSocket(accessToken);
    // Sync current connection state async: `socket.connected` may already be true if this
    // effect is reusing a connection from useSocketConnection, whose 'connect' event fired
    // before this listener was attached.
    queueMicrotask(() => setStatus(socket.connected ? 'connected' : 'disconnected'));

    const onConnect = () => setStatus('connected');
    const onDisconnect = () => setStatus('disconnected');
    const onReconnectAttempt = () => setStatus('reconnecting');

    const onSuccessMessage = (payload: SuccessMessageEvent) => {
      if (payload.from !== friendId) return;
      messageIdCounter.current += 1;
      setLiveMessages((prev) => [
        ...prev,
        {
          _id: `incoming-${messageIdCounter.current}`,
          sender: friendId,
          content: payload.message,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.io.on('reconnect_attempt', onReconnectAttempt);
    socket.on('successMessage', onSuccessMessage);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.io.off('reconnect_attempt', onReconnectAttempt);
      socket.off('successMessage', onSuccessMessage);
    };
  }, [friendId, accessToken]);

  const sendMessage = useCallback(
    (content: string) => {
      const socket = getSocket();
      if (!socket || !me) return;
      socket.emit('sendMessage', { to: friendId, message: content });
      messageIdCounter.current += 1;
      setLiveMessages((prev) => [
        ...prev,
        {
          _id: `outgoing-${messageIdCounter.current}`,
          sender: me._id,
          content,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
    },
    [friendId, me],
  );

  return { liveMessages, status, sendMessage };
}
