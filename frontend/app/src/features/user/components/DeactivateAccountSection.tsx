import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeactivateAccount } from '@/features/user/useProfileMutations';
import { useLogout } from '@/features/auth/useAuth';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ApiErrorAlert } from '@/components/shared/ApiErrorAlert';

export function DeactivateAccountSection() {
  const [isOpen, setIsOpen] = useState(false);
  const deactivate = useDeactivateAccount();
  const logout = useLogout();
  const navigate = useNavigate();

  const onConfirm = () => {
    deactivate.mutate(undefined, {
      onSuccess: () => {
        logout();
        navigate('/login', { replace: true });
      },
    });
  };

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
      <h3 className="text-sm font-semibold text-red-800">Deactivate account</h3>
      <p className="text-sm text-red-700">
        This deactivates your account and logs you out. This action is not reversible from the app.
      </p>
      <Button variant="danger" className="self-start" onClick={() => setIsOpen(true)}>
        Deactivate account
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Deactivate your account?">
        <div className="flex flex-col gap-3">
          {deactivate.isError && <ApiErrorAlert error={deactivate.error} />}
          <p className="text-sm text-gray-600">
            Are you sure you want to deactivate your account? You will be logged out immediately.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={onConfirm} isLoading={deactivate.isPending}>
              Yes, deactivate
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
