import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePost } from '@/features/posts/usePostsQueries';
import { useUpdatePost } from '@/features/posts/usePostMutations';
import { postFormSchema, type PostFormValues } from '@/features/posts/schemas';
import { MultiImagePicker } from '@/components/shared/MultiImagePicker';
import { Button } from '@/components/ui/Button';
import { ApiErrorAlert } from '@/components/shared/ApiErrorAlert';
import { PageSpinner } from '@/components/shared/PageSpinner';
import { toast } from '@/store/toast.store';

export function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: post, isLoading } = usePost(id ?? '');
  const updatePost = useUpdatePost(id ?? '');

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    values: { text: post?.text ?? '', images: [] },
  });

  const onSubmit = (values: PostFormValues) => {
    updatePost.mutate(
      { text: values.text || undefined, images: values.images.length ? values.images : undefined },
      {
        onSuccess: () => {
          toast.success('Post updated');
          navigate(`/posts/${id}`);
        },
      },
    );
  };

  if (isLoading) return <PageSpinner />;
  if (!post) return null;

  return (
    <form
      className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <h1 className="text-lg font-semibold text-gray-900">Edit post</h1>
      {updatePost.isError && <ApiErrorAlert error={updatePost.error} />}
      <textarea
        {...register('text')}
        rows={3}
        className="w-full resize-none rounded-lg border border-gray-300 p-3 text-sm outline-none focus:ring-2 focus:ring-brand-500"
      />
      {errors.text && <p className="text-sm text-red-600">{errors.text.message}</p>}

      {post.images.length > 0 && (
        <div>
          <p className="mb-1 text-xs text-gray-500">
            Current images (uploading new ones below replaces all of them)
          </p>
          <div className="flex flex-wrap gap-2">
            {post.images.map((img) => (
              <img
                key={img.public_id}
                src={img.secure_url}
                alt=""
                className="h-16 w-16 rounded-lg object-cover"
              />
            ))}
          </div>
        </div>
      )}

      <Controller
        control={control}
        name="images"
        render={({ field }) => <MultiImagePicker files={field.value} onChange={field.onChange} />}
      />

      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button type="submit" isLoading={updatePost.isPending}>
          Save changes
        </Button>
      </div>
    </form>
  );
}
