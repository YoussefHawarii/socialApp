import { useLikeUnlikePost } from '@/features/posts/usePostMutations';
import { useCurrentUser } from '@/features/user/useCurrentUser';
import type { Post } from '@/types/post';

export function LikeButton({ post }: { post: Post }) {
  const { data: me } = useCurrentUser();
  const likeUnlike = useLikeUnlikePost();

  const likeIds = post.likes.map((l) => (typeof l === 'string' ? l : l._id));
  const hasLiked = !!me && likeIds.includes(me._id);

  return (
    <button
      type="button"
      onClick={() => likeUnlike.mutate(post._id)}
      disabled={likeUnlike.isPending}
      aria-pressed={hasLiked}
      className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm transition-colors ${
        hasLiked ? 'text-brand-600' : 'text-gray-500 hover:text-brand-600'
      }`}
    >
      <span aria-hidden="true">{hasLiked ? '♥' : '♡'}</span>
      {likeIds.length}
    </button>
  );
}
