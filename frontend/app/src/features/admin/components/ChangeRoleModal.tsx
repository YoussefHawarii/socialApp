import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { ApiErrorAlert } from '@/components/shared/ApiErrorAlert';
import { useChangeUserRole } from '@/features/admin/useAdmin';
import { roles, type Role } from '@/lib/constants';
import { toast } from '@/store/toast.store';
import type { User } from '@/types/user';

interface ChangeRoleModalProps {
  user: User | null;
  onClose: () => void;
}

export function ChangeRoleModal({ user, onClose }: ChangeRoleModalProps) {
  const [selectedRole, setSelectedRole] = useState<Role>(user?.role ?? roles.user);
  const changeRole = useChangeUserRole();

  if (!user) return null;

  const onConfirm = () => {
    changeRole.mutate(
      { userId: user._id, role: selectedRole },
      {
        onSuccess: () => {
          toast.success(`Role updated for ${user.userName}`);
          onClose();
        },
      },
    );
  };

  return (
    <Modal isOpen={!!user} onClose={onClose} title={`Change role for ${user.userName}`}>
      <div className="flex flex-col gap-3">
        {changeRole.isError && <ApiErrorAlert error={changeRole.error} />}
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value as Role)}
          aria-label="New role"
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500"
        >
          {Object.values(roles).map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500">
          You can only change the role of users ranked below you.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            isLoading={changeRole.isPending}
            disabled={selectedRole === user.role}
          >
            Confirm
          </Button>
        </div>
      </div>
    </Modal>
  );
}
