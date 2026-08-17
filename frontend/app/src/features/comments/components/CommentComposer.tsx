import { useState } from 'react';
import { SingleImagePicker } from '@/components/shared/SingleImagePicker';
import { Button } from '@/components/ui/Button';
import { ApiErrorAlert } from '@/components/shared/ApiErrorAlert';

interface CommentComposerProps {
  placeholder: string;
  submitLabel: string;
  isSubmitting: boolean;
  error?: unknown;
  initialText?: string;
  onSubmit: (values: { text?: string; image?: File }) => void;
  onCancel?: () => void;
}

export function CommentComposer({
  placeholder,
  submitLabel,
  isSubmitting,
  error,
  initialText = '',
  onSubmit,
  onCancel,
}: CommentComposerProps) {
  const [text, setText] = useState(initialText);
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !image) return;
    onSubmit({ text: text.trim() || undefined, image: image ?? undefined });
    setText('');
    setImage(null);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      {!!error && <ApiErrorAlert error={error} />}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        rows={2}
        className="w-full resize-none rounded-lg border border-gray-300 p-2 text-sm outline-none focus:ring-2 focus:ring-brand-500"
      />
      <div className="flex items-center justify-between">
        <SingleImagePicker file={image} onChange={setImage} />
        <div className="flex gap-2">
          {onCancel && (
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" isLoading={isSubmitting} disabled={!text.trim() && !image}>
            {submitLabel}
          </Button>
        </div>
      </div>
    </form>
  );
}
