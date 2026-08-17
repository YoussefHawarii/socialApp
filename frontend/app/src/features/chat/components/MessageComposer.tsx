import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function MessageComposer({ onSend }: { onSend: (content: string) => void }) {
  const [value, setValue] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSend(value.trim());
    setValue('');
  };

  return (
    <form onSubmit={submit} className="flex gap-2 border-t border-gray-200 p-3">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type a message..."
        aria-label="Message"
      />
      <Button type="submit" disabled={!value.trim()}>
        Send
      </Button>
    </form>
  );
}
