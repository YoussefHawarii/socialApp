import { useEffect, useMemo } from 'react';

interface SingleImagePickerProps {
  file: File | null;
  onChange: (file: File | null) => void;
}

export function SingleImagePicker({ file, onChange }: SingleImagePickerProps) {
  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        className="text-xs"
        aria-label="Attach image"
      />
      {previewUrl && (
        <div className="relative">
          <img src={previewUrl} alt="" className="h-10 w-10 rounded-lg object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label="Remove image"
            className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gray-900 text-[10px] text-white"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
