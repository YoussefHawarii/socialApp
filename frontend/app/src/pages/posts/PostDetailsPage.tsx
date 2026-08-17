import { useParams } from 'react-router-dom';
import { usePost } from '@/features/posts/usePostsQueries';
import { PostCard } from '@/features/posts/components/PostCard';
import { CommentsPanel } from '@/features/comments/components/CommentsPanel';
import { PageSpinner } from '@/components/shared/PageSpinner';
import { ApiErrorAlert } from '@/components/shared/ApiErrorAlert';

export function PostDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: post, isLoading, error } = usePost(id ?? '');

  if (isLoading) return <PageSpinner />;
  if (error) return <ApiErrorAlert error={error} />;
  if (!post) return null;

  return (
    <div className="flex flex-col gap-6">
      <PostCard post={post} />
      <CommentsPanel postId={post._id} />
    </div>
  );
}
