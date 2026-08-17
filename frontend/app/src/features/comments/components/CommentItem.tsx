import { useState } from 'react';
import type { Comment } from '@/types/comment';
import { useCurrentUser } from '@/features/user/useCurrentUser';
import {
  useHardDeleteComment,
  useLikeUnlikeComment,
  useReplyComment,
  useSoftDeleteComment,
  useUpdateComment,
} from '@/features/comments/useCommentMutations';
import { CommentComposer } from './CommentComposer';

function authorName(user: Comment['user']): string {
  return typeof user === 'string' ? 'Unknown user' : user.userName;
}

function authorId(user: Comment['user']): string | null {
  return typeof user === 'string' ? user : user._id;
}

interface CommentItemProps {
  postId: string;
  comment: Comment;
  isReply?: boolean;
}

export function CommentItem({ postId, comment, isReply = false }: CommentItemProps) {
  const { data: me } = useCurrentUser();
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  const updateComment = useUpdateComment(postId);
  const softDelete = useSoftDeleteComment(postId);
  const hardDelete = useHardDeleteComment(postId);
  const likeUnlike = useLikeUnlikeComment(postId);
  const reply = useReplyComment(postId);

  if (comment.isDeleted) {
    return <p className="text-sm text-gray-400 italic">This comment was deleted.</p>;
  }

  const isOwner = !!me && authorId(comment.user) === me._id;
  const likeIds = comment.likes.map((l) => (typeof l === 'string' ? l : l._id));
  const hasLiked = !!me && likeIds.includes(me._id);

  return (
    <div className={isReply ? 'ml-8' : ''}>
      <div className="rounded-lg border border-gray-200 bg-white p-3">
        <p className="text-sm font-medium text-gray-900">{authorName(comment.user)}</p>

        {isEditing ? (
          <CommentComposer
            placeholder="Edit your comment"
            submitLabel="Save"
            isSubmitting={updateComment.isPending}
            error={updateComment.error}
            initialText={comment.text ?? ''}
            onCancel={() => setIsEditing(false)}
            onSubmit={(values) => {
              updateComment.mutate(
                { commentId: comment._id, ...values },
                { onSuccess: () => setIsEditing(false) },
              );
            }}
          />
        ) : (
          <>
            {comment.text && <p className="mt-1 text-sm text-gray-700">{comment.text}</p>}
            {comment.image && (
              <img src={comment.image.secure_url} alt="" className="mt-2 h-24 w-24 rounded-lg object-cover" />
            )}
          </>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500">
          <button
            type="button"
            onClick={() => likeUnlike.mutate(comment._id)}
            aria-pressed={hasLiked}
            className={hasLiked ? 'text-brand-600' : 'hover:text-brand-600'}
          >
            {hasLiked ? '♥' : '♡'} {likeIds.length}
          </button>
          {!isReply && (
            <button type="button" onClick={() => setIsReplying((v) => !v)} className="hover:text-brand-600">
              Reply
            </button>
          )}
          {isOwner && !isEditing && (
            <button type="button" onClick={() => setIsEditing(true)} className="hover:text-brand-600">
              Edit
            </button>
          )}
          {isOwner && (
            <button
              type="button"
              onClick={() => softDelete.mutate(comment._id)}
              className="hover:text-red-600"
            >
              Delete
            </button>
          )}
          {isOwner && (
            <button
              type="button"
              onClick={() => {
                if (confirm('Permanently delete this comment and its replies?')) {
                  hardDelete.mutate(comment._id);
                }
              }}
              className="hover:text-red-600"
            >
              Delete permanently
            </button>
          )}
        </div>

        {isReplying && (
          <div className="mt-3">
            <CommentComposer
              placeholder="Write a reply..."
              submitLabel="Reply"
              isSubmitting={reply.isPending}
              error={reply.error}
              onCancel={() => setIsReplying(false)}
              onSubmit={(values) => {
                reply.mutate(
                  { commentId: comment._id, ...values },
                  { onSuccess: () => setIsReplying(false) },
                );
              }}
            />
          </div>
        )}
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2 flex flex-col gap-2">
          {comment.replies.map((r) => (
            <CommentItem key={r._id} postId={postId} comment={r} isReply />
          ))}
        </div>
      )}
    </div>
  );
}
