import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { postFormSchema, type PostFormValues } from '@/features/posts/schemas';
import { useCreatePost } from '@/features/posts/usePostMutations';
import { MultiImagePicker } from '@/components/shared/MultiImagePicker';
import { Button } from '@/components/ui/Button';
import { ApiErrorAlert } from '@/components/shared/ApiErrorAlert';
import { toast } from '@/store/toast.store';

export function CreatePostForm() {
  const [isOpen, setIsOpen] = useState(false);
  const createPost = useCreatePost();
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: { text: '', images: [] },
  });

  const onSubmit = (values: PostFormValues) => {
    createPost.mutate(
      { text: values.text || undefined, images: values.images },
      {
        onSuccess: () => {
          toast.success('Post created');
          reset({ text: '', images: [] });
          setIsOpen(false);
        },
      },
    );
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full rounded-xl border border-gray-200 bg-white p-4 text-left text-sm text-gray-500 hover:bg-gray-50"
      >
        What&apos;s on your mind?
      </button>
    );
  }

  return (
    <form
      className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      {createPost.isError && <ApiErrorAlert error={createPost.error} />}
      <textarea
        {...register('text')}
        placeholder="What's on your mind?"
        rows={3}
        className="w-full resize-none rounded-lg border border-gray-300 p-3 text-sm outline-none focus:ring-2 focus:ring-brand-500"
      />
      {errors.text && <p className="text-sm text-red-600">{errors.text.message}</p>}

      <Controller
        control={control}
        name="images"
        render={({ field }) => <MultiImagePicker files={field.value} onChange={field.onChange} />}
      />

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            reset({ text: '', images: [] });
            setIsOpen(false);
          }}
        >
          Cancel
        </Button>
        <Button type="submit" isLoading={createPost.isPending}>
          Post
        </Button>
      </div>
    </form>
  );
}
