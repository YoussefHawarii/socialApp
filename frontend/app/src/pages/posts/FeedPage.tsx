import { useState } from 'react';
import { useActivePosts, useNonActivePosts } from '@/features/posts/usePostsQueries';
import { CreatePostForm } from '@/features/posts/components/CreatePostForm';
import { PostCard } from '@/features/posts/components/PostCard';
import { Pagination } from '@/components/shared/Pagination';
import { PageSpinner } from '@/components/shared/PageSpinner';
import { ApiErrorAlert } from '@/components/shared/ApiErrorAlert';
import { EmptyState } from '@/components/shared/EmptyState';

type Tab = 'active' | 'archived';

function ActiveTab() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useActivePosts(page);

  return (
    <div className="flex flex-col gap-4">
      <CreatePostForm />
      {isLoading && <PageSpinner />}
      {error && <ApiErrorAlert error={error} />}
      {data && data.data.length === 0 && (
        <EmptyState title="No posts yet" description="Be the first to share something." />
      )}
      {data?.data.map((post) => <PostCard key={post._id} post={post} />)}
      {data && (
        <Pagination currentPage={data.currentPage} totalPages={data.totalPages} onPageChange={setPage} />
      )}
    </div>
  );
}

function ArchivedTab() {
  const { data, isLoading, error } = useNonActivePosts();

  return (
    <div className="flex flex-col gap-4">
      {isLoading && <PageSpinner />}
      {error && <ApiErrorAlert error={error} />}
      {data && data.length === 0 && (
        <EmptyState title="No deleted posts" description="Soft-deleted posts you can restore appear here." />
      )}
      {data?.map((post) => <PostCard key={post._id} post={post} showRestore />)}
    </div>
  );
}

export function FeedPage() {
  const [tab, setTab] = useState<Tab>('active');

  return (
    <div className="flex flex-col gap-4">
      <div role="tablist" aria-label="Post visibility" className="flex gap-2 border-b border-gray-200">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'active'}
          onClick={() => setTab('active')}
          className={`border-b-2 px-3 py-2 text-sm font-medium ${
            tab === 'active' ? 'border-brand-600 text-brand-700' : 'border-transparent text-gray-500'
          }`}
        >
          Feed
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'archived'}
          onClick={() => setTab('archived')}
          className={`border-b-2 px-3 py-2 text-sm font-medium ${
            tab === 'archived' ? 'border-brand-600 text-brand-700' : 'border-transparent text-gray-500'
          }`}
        >
          Archived
        </button>
      </div>

      {tab === 'active' ? <ActiveTab /> : <ArchivedTab />}
    </div>
  );
}
