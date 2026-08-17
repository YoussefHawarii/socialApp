import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { resetPasswordSchema, type ResetPasswordFormValues } from '@/features/auth/schemas';
import { useResetPassword } from '@/features/auth/useAuth';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';
import { Button } from '@/components/ui/Button';
import { ApiErrorAlert } from '@/components/shared/ApiErrorAlert';
import { toast } from '@/store/toast.store';

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const prefillEmail = (location.state as { email?: string })?.email ?? '';
  const resetPassword = useResetPassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: prefillEmail },
  });

  const onSubmit = (values: ResetPasswordFormValues) => {
    resetPassword.mutate(values, {
      onSuccess: () => {
        toast.success('Password reset successfully. Please log in.');
        navigate('/login', { replace: true });
      },
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Reset password</h1>
        <p className="mt-1 text-sm text-gray-500">Enter the OTP you received and your new password.</p>
      </div>
      {resetPassword.isError && <ApiErrorAlert error={resetPassword.error} />}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField label="Email" htmlFor="email" error={errors.email?.message}>
          <Input id="email" type="email" autoComplete="email" {...register('email')} />
        </FormField>
        <FormField label="OTP" htmlFor="otp" error={errors.otp?.message}>
          <Input id="otp" type="text" maxLength={5} {...register('otp')} />
        </FormField>
        <FormField label="New password" htmlFor="password" error={errors.password?.message}>
          <Input id="password" type="password" autoComplete="new-password" {...register('password')} />
        </FormField>
        <FormField
          label="Confirm new password"
          htmlFor="confirmPassword"
          error={errors.confirmPassword?.message}
        >
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            {...register('confirmPassword')}
          />
        </FormField>
        <Button type="submit" className="w-full" isLoading={resetPassword.isPending}>
          Reset password
        </Button>
      </form>
      <p className="text-center text-sm text-gray-500">
        <Link to="/login" className="text-brand-600 hover:underline">
          Back to login
        </Link>
      </p>
    </div>
  );
}
