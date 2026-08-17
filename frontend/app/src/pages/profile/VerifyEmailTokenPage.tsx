import { useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useVerifyEmailToken } from '@/features/user/useVerifyEmailToken';
import { queryKeys } from '@/lib/queryKeys';
import { PageSpinner } from '@/components/shared/PageSpinner';
import { Alert } from '@/components/ui/Alert';
import { ApiErrorAlert } from '@/components/shared/ApiErrorAlert';

export function VerifyEmailTokenPage() {
  const { token } = useParams<{ token: string }>();
  const verifyEmailToken = useVerifyEmailToken();
  const queryClient = useQueryClient();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current || !token) return;
    hasRun.current = true;
    verifyEmailToken.mutate(token, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.me }),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-gray-900">Verify email</h1>
      {verifyEmailToken.isPending && <PageSpinner />}
      {verifyEmailToken.isError && <ApiErrorAlert error={verifyEmailToken.error} />}
      {verifyEmailToken.isSuccess && (
        <Alert variant="success">{verifyEmailToken.data.message}</Alert>
      )}
      <p className="text-center text-sm text-gray-500">
        <Link to="/profile" className="text-brand-600 hover:underline">
          Go to profile
        </Link>
      </p>
    </div>
  );
}
