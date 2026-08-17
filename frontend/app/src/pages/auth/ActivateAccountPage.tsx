import { useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useActivateAccount } from '@/features/auth/useAuth';
import { PageSpinner } from '@/components/shared/PageSpinner';
import { Alert } from '@/components/ui/Alert';
import { ApiErrorAlert } from '@/components/shared/ApiErrorAlert';

export function ActivateAccountPage() {
  const { token } = useParams<{ token: string }>();
  const activateAccount = useActivateAccount();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current || !token) return;
    hasRun.current = true;
    activateAccount.mutate(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-gray-900">Account activation</h1>
      {activateAccount.isPending && <PageSpinner />}
      {activateAccount.isError && <ApiErrorAlert error={activateAccount.error} />}
      {activateAccount.isSuccess && (
        <Alert variant="success">{activateAccount.data.message}</Alert>
      )}
      <p className="text-center text-sm text-gray-500">
        <Link to="/login" className="text-brand-600 hover:underline">
          Go to login
        </Link>
      </p>
    </div>
  );
}
