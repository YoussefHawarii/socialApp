import { useState } from 'react';
import { useAdminOverview } from '@/features/admin/useAdmin';
import { ChangeRoleModal } from '@/features/admin/components/ChangeRoleModal';
import { PageSpinner } from '@/components/shared/PageSpinner';
import { ApiErrorAlert } from '@/components/shared/ApiErrorAlert';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/Button';
import type { User } from '@/types/user';

export function AdminPage() {
  const { data, isLoading, error } = useAdminOverview();
  const [editingUser, setEditingUser] = useState<User | null>(null);

  if (isLoading) return <PageSpinner />;
  if (error) return <ApiErrorAlert error={error} />;
  if (!data) return null;

  const [users, posts] = data;

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-3 text-sm font-semibold text-gray-900">Users ({users.length})</h2>
        {users.length === 0 ? (
          <EmptyState title="No users found" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500">
                  <th className="py-2 pr-4">Username</th>
                  <th className="py-2 pr-4">Email</th>
                  <th className="py-2 pr-4">Role</th>
                  <th className="py-2 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b border-gray-100">
                    <td className="py-2 pr-4">{u.userName}</td>
                    <td className="py-2 pr-4">{u.email}</td>
                    <td className="py-2 pr-4">
                      <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-2 pr-4">
                      <Button variant="secondary" onClick={() => setEditingUser(u)}>
                        Change role
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-3 text-sm font-semibold text-gray-900">Posts ({posts.length})</h2>
        {posts.length === 0 ? (
          <EmptyState title="No posts found" />
        ) : (
          <ul className="flex flex-col gap-2">
            {posts.map((post) => (
              <li key={post._id} className="rounded-lg border border-gray-200 p-2 text-sm text-gray-700">
                <span className="font-mono text-xs text-gray-400">{post.user}:</span>{' '}
                {post.text ?? '(image post)'}
                {post.isDeleted && <span className="ml-2 text-xs text-red-500">(deleted)</span>}
              </li>
            ))}
          </ul>
        )}
      </div>

      <ChangeRoleModal user={editingUser} onClose={() => setEditingUser(null)} />
    </div>
  );
}
