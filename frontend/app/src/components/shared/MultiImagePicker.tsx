import { useEffect, useMemo } from 'react';

interface MultiImagePickerProps {
  files: File[];
  onChange: (files: File[]) => void;
}

export function MultiImagePicker({ files, onChange }: MultiImagePickerProps) {
  const previewUrls = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);

  useEffect(() => {
    return () => previewUrls.forEach((u) => URL.revokeObjectURL(u));
  }, [previewUrls]);

  const onAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files ?? []);
    onChange([...files, ...newFiles]);
    e.target.value = '';
  };

  const onRemove = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-2">
      <input type="file" accept="image/*" multiple onChange={onAdd} className="text-sm" aria-label="Add images" />
      {previewUrls.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {previewUrls.map((url, index) => (
            <div key={url} className="relative">
              <img src={url} alt="" className="h-20 w-20 rounded-lg object-cover" />
              <button
                type="button"
                onClick={() => onRemove(index)}
                aria-label="Remove image"
                className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-xs text-white"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
