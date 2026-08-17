import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { connectSocket, disconnectSocket } from '@/services/socket';

/** Keeps the Socket.IO connection alive for as long as the user is authenticated. Mounted once in AppLayout. */
export function useSocketConnection() {
  const accessToken = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (!accessToken) {
      disconnectSocket();
      return;
    }
    connectSocket(accessToken);
    return () => disconnectSocket();
  }, [accessToken]);
}
