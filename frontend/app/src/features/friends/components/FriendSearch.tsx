import { useEffect, useState } from 'react';
import { useSearchUsers, MIN_SEARCH_LENGTH } from '@/features/friends/useFriendQueries';
import { SearchResultRow } from '@/features/friends/components/SearchResultRow';
import { Input } from '@/components/ui/Input';
import { Pagination } from '@/components/shared/Pagination';
import { PageSpinner } from '@/components/shared/PageSpinner';
import { ApiErrorAlert } from '@/components/shared/ApiErrorAlert';
import { EmptyState } from '@/components/shared/EmptyState';

const DEBOUNCE_MS = 400;

export function FriendSearch() {
  const [input, setInput] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(input.trim());
      setPage(1);
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [input]);

  const { data, isLoading, error } = useSearchUsers(query, page);
  const showResultsPanel = query.length >= MIN_SEARCH_LENGTH;

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-gray-900">Find friends</h3>
      <Input
        placeholder="Search by username..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        aria-label="Search users by username"
      />

      {showResultsPanel && (
        <div className="flex flex-col gap-2">
          {isLoading && <PageSpinner />}
          {error && <ApiErrorAlert error={error} />}
          {data && data.data.length === 0 && (
            <EmptyState title="No users found" description={`No results for "${query}".`} />
          )}
          {data && data.data.length > 0 && (
            <ul className="flex flex-col gap-2">
              {data.data.map((result) => (
                <SearchResultRow key={result._id} result={result} />
              ))}
            </ul>
          )}
          {data && (
            <Pagination
              currentPage={data.currentPage}
              totalPages={data.totalPages}
              onPageChange={setPage}
            />
          )}
        </div>
      )}
    </div>
  );
}
