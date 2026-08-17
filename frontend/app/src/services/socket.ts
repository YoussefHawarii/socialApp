import { io, type Socket } from 'socket.io-client';
import { SOCKET_URL } from '@/lib/constants';

let socket: Socket | null = null;

export function connectSocket(accessToken: string): Socket {
  if (socket?.connected && socket.auth && (socket.auth as { authorization?: string }).authorization === `Bearer ${accessToken}`) {
    return socket;
  }
  if (socket) {
    socket.disconnect();
  }
  socket = io(SOCKET_URL, {
    auth: { authorization: `Bearer ${accessToken}` },
    autoConnect: true,
    reconnection: true,
  });
  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}

export function getSocket(): Socket | null {
  return socket;
}
