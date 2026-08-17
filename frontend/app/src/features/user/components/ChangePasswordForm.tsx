import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePasswordSchema, type ChangePasswordFormValues } from '@/features/user/schemas';
import { useChangePassword } from '@/features/user/useProfileMutations';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';
import { Button } from '@/components/ui/Button';
import { ApiErrorAlert } from '@/components/shared/ApiErrorAlert';
import { toast } from '@/store/toast.store';

export function ChangePasswordForm() {
  const changePassword = useChangePassword();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({ resolver: zodResolver(changePasswordSchema) });

  const onSubmit = (values: ChangePasswordFormValues) => {
    changePassword.mutate(values, {
      onSuccess: () => {
        toast.success('Password changed successfully');
        reset();
      },
    });
  };

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)} noValidate>
      <h3 className="text-sm font-semibold text-gray-900">Change password</h3>
      {changePassword.isError && <ApiErrorAlert error={changePassword.error} />}
      <FormField label="Current password" htmlFor="oldPassword" error={errors.oldPassword?.message}>
        <Input id="oldPassword" type="password" autoComplete="current-password" {...register('oldPassword')} />
      </FormField>
      <FormField label="New password" htmlFor="newPassword" error={errors.password?.message}>
        <Input id="newPassword" type="password" autoComplete="new-password" {...register('password')} />
      </FormField>
      <FormField
        label="Confirm new password"
        htmlFor="confirmNewPassword"
        error={errors.confirmPassword?.message}
      >
        <Input
          id="confirmNewPassword"
          type="password"
          autoComplete="new-password"
          {...register('confirmPassword')}
        />
      </FormField>
      <Button type="submit" isLoading={changePassword.isPending} className="self-start">
        Update password
      </Button>
    </form>
  );
}
