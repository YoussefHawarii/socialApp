import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { forgetPasswordSchema, type ForgetPasswordFormValues } from '@/features/auth/schemas';
import { useForgetPassword } from '@/features/auth/useAuth';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';
import { Button } from '@/components/ui/Button';
import { ApiErrorAlert } from '@/components/shared/ApiErrorAlert';
import { toast } from '@/store/toast.store';

export function ForgetPasswordPage() {
  const navigate = useNavigate();
  const forgetPassword = useForgetPassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgetPasswordFormValues>({ resolver: zodResolver(forgetPasswordSchema) });

  const onSubmit = (values: ForgetPasswordFormValues) => {
    forgetPassword.mutate(values, {
      onSuccess: () => {
        toast.success('OTP sent to your email');
        navigate('/reset-password', { state: { email: values.email } });
      },
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Forgot password</h1>
        <p className="mt-1 text-sm text-gray-500">We&apos;ll send you an OTP to reset it.</p>
      </div>
      {forgetPassword.isError && <ApiErrorAlert error={forgetPassword.error} />}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField label="Email" htmlFor="email" error={errors.email?.message}>
          <Input id="email" type="email" autoComplete="email" {...register('email')} />
        </FormField>
        <Button type="submit" className="w-full" isLoading={forgetPassword.isPending}>
          Send OTP
        </Button>
      </form>
      <p className="text-center text-sm text-gray-500">
        Remembered your password?{' '}
        <Link to="/login" className="text-brand-600 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
