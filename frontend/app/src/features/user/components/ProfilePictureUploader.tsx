import { useRef, useState } from 'react';
import type { User } from '@/types/user';
import { useDeleteProfilePicture, useUploadProfilePicture } from '@/features/user/useProfileMutations';
import { Button } from '@/components/ui/Button';
import { ApiErrorAlert } from '@/components/shared/ApiErrorAlert';
import { toast } from '@/store/toast.store';

interface ProfilePictureUploaderProps {
  user: User;
}

export function ProfilePictureUploader({ user }: ProfilePictureUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const upload = useUploadProfilePicture();
  const remove = useDeleteProfilePicture();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const onUpload = () => {
    if (!selectedFile) return;
    upload.mutate(selectedFile, {
      onSuccess: () => {
        toast.success('Profile picture updated');
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      },
    });
  };

  const onDelete = () => {
    remove.mutate(undefined, {
      onSuccess: () => toast.success('Profile picture removed'),
    });
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <img
        src={previewUrl ?? user.profilePicture.secure_url}
        alt="Profile"
        className="h-24 w-24 rounded-full object-cover ring-2 ring-gray-200"
      />
      {(upload.isError || remove.isError) && <ApiErrorAlert error={upload.error ?? remove.error} />}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onFileChange}
        className="text-sm"
        aria-label="Choose profile picture"
      />
      <div className="flex gap-2">
        <Button
          variant="secondary"
          onClick={onUpload}
          disabled={!selectedFile}
          isLoading={upload.isPending}
        >
          Save picture
        </Button>
        <Button variant="danger" onClick={onDelete} isLoading={remove.isPending}>
          Remove
        </Button>
      </div>
    </div>
  );
}
