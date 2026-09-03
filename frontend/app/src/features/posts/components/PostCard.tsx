import { Link } from 'react-router-dom';
import type { Post } from '@/types/post';
import { useCurrentUser } from '@/features/user/useCurrentUser';
import { useSoftDeletePost, useRestorePost } from '@/features/posts/usePostMutations';
import { LikeButton } from './LikeButton';
import { Button } from '@/components/ui/Button';
import { withCloudinaryLimit } from '@/lib/cloudinaryImage';

interface PostCardProps {
  post: Post;
  showRestore?: boolean;
}

export function PostCard({ post, showRestore = false }: PostCardProps) {
  const { data: me } = useCurrentUser();
  const softDelete = useSoftDeletePost();
  const restore = useRestorePost();

  const canManage = me && (me._id === post.user._id || me.role === 'admin' || me.role === 'superAdmin');

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-center gap-2">
        <img
          src={post.user.profilePicture?.secure_url}
          alt=""
          className="h-9 w-9 rounded-full object-cover"
        />
        <div>
          <p className="text-sm font-medium text-gray-900">{post.user.userName}</p>
          <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
        </div>
      </div>

      {post.text && <p className="mt-3 text-sm text-gray-800">{post.text}</p>}

      {post.images.length === 1 && (
        <div className="mt-3">
          <img
            src={withCloudinaryLimit(post.images[0].secure_url, 1200)}
            alt=""
            className="max-h-[420px] w-full rounded-lg bg-gray-100 object-contain"
          />
        </div>
      )}

      {post.images.length > 1 && (
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {post.images.map((img) => (
            <img
              key={img.public_id}
              src={withCloudinaryLimit(img.secure_url, 600)}
              alt=""
              className="h-48 w-full rounded-lg bg-gray-100 object-cover"
            />
          ))}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LikeButton post={post} />
          <Link to={`/posts/${post._id}`} className="text-sm text-gray-500 hover:text-brand-600">
            View details
          </Link>
        </div>

        {canManage && (
          <div className="flex gap-2">
            {showRestore ? (
              <Button
                variant="secondary"
                onClick={() => restore.mutate(post._id)}
                isLoading={restore.isPending}
              >
                Restore
              </Button>
            ) : (
              <>
                <Link to={`/posts/${post._id}/edit`}>
                  <Button variant="secondary">Edit</Button>
                </Link>
                <Button
                  variant="danger"
                  onClick={() => softDelete.mutate(post._id)}
                  isLoading={softDelete.isPending}
                >
                  Delete
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
