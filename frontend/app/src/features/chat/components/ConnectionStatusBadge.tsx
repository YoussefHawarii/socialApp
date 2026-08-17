import type { SocketStatus } from '@/features/chat/useChatSocket';

const statusStyles: Record<SocketStatus, string> = {
  connected: 'bg-green-100 text-green-700',
  disconnected: 'bg-red-100 text-red-700',
  reconnecting: 'bg-amber-100 text-amber-700',
};

const statusLabels: Record<SocketStatus, string> = {
  connected: 'Connected',
  disconnected: 'Disconnected',
  reconnecting: 'Reconnecting…',
};

export function ConnectionStatusBadge({ status }: { status: SocketStatus }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[status]}`}>
      {statusLabels[status]}
    </span>
  );
}
