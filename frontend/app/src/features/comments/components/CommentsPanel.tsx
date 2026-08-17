import { useComments } from '@/features/comments/useCommentsQueries';
import { useCreateComment } from '@/features/comments/useCommentMutations';
import { CommentComposer } from './CommentComposer';
import { CommentItem } from './CommentItem';
import { PageSpinner } from '@/components/shared/PageSpinner';
import { ApiErrorAlert } from '@/components/shared/ApiErrorAlert';
import { EmptyState } from '@/components/shared/EmptyState';

export function CommentsPanel({ postId }: { postId: string }) {
  const { data: comments, isLoading, error } = useComments(postId);
  const createComment = useCreateComment(postId);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4">
      <h2 className="text-sm font-semibold text-gray-900">Comments</h2>

      <CommentComposer
        placeholder="Write a comment..."
        submitLabel="Comment"
        isSubmitting={createComment.isPending}
        error={createComment.error}
        onSubmit={(values) => createComment.mutate(values)}
      />

      {isLoading && <PageSpinner />}
      {error && <ApiErrorAlert error={error} />}
      {comments && comments.length === 0 && (
        <EmptyState title="No comments yet" description="Be the first to comment on this post." />
      )}

      <div className="flex flex-col gap-3">
        {comments?.map((comment) => (
          <CommentItem key={comment._id} postId={postId} comment={comment} />
        ))}
      </div>
    </div>
  );
}
