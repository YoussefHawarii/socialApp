import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import {
  registerSchema,
  sendOtpSchema,
  type RegisterFormValues,
  type SendOtpFormValues,
} from '@/features/auth/schemas';
import { useRegister, useSendOtp } from '@/features/auth/useAuth';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';
import { Button } from '@/components/ui/Button';
import { ApiErrorAlert } from '@/components/shared/ApiErrorAlert';
import { toast } from '@/store/toast.store';

function OtpStep({ onSent }: { onSent: (email: string) => void }) {
  const sendOtp = useSendOtp();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SendOtpFormValues>({ resolver: zodResolver(sendOtpSchema) });

  const onSubmit = (values: SendOtpFormValues) => {
    sendOtp.mutate(values, {
      onSuccess: () => {
        toast.success('OTP sent to your email');
        onSent(values.email);
      },
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Create an account</h1>
        <p className="mt-1 text-sm text-gray-500">Step 1 — verify your email with an OTP.</p>
      </div>
      {sendOtp.isError && <ApiErrorAlert error={sendOtp.error} />}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField label="Email" htmlFor="email" error={errors.email?.message}>
          <Input id="email" type="email" autoComplete="email" {...register('email')} />
        </FormField>
        <Button type="submit" className="w-full" isLoading={sendOtp.isPending}>
          Send OTP
        </Button>
      </form>
      <p className="text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link to="/login" className="text-brand-600 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}

function RegisterStep({ email }: { email: string }) {
  const navigate = useNavigate();
  const registerUser = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email },
  });

  const onSubmit = (values: RegisterFormValues) => {
    registerUser.mutate(values, {
      onSuccess: () => {
        toast.success('Account created! Check your email to activate it, then log in.');
        navigate('/login', { replace: true });
      },
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Create an account</h1>
        <p className="mt-1 text-sm text-gray-500">Step 2 — enter the OTP and set your credentials.</p>
      </div>
      {registerUser.isError && <ApiErrorAlert error={registerUser.error} />}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <input type="hidden" {...register('email')} />
        <FormField label="Email" htmlFor="email-readonly">
          <Input id="email-readonly" type="email" value={email} disabled readOnly />
        </FormField>
        <FormField label="OTP" htmlFor="otp" error={errors.otp?.message}>
          <Input id="otp" type="text" maxLength={5} {...register('otp')} />
        </FormField>
        <FormField label="Username" htmlFor="userName" error={errors.userName?.message}>
          <Input id="userName" type="text" autoComplete="username" {...register('userName')} />
        </FormField>
        <FormField label="Password" htmlFor="password" error={errors.password?.message}>
          <Input id="password" type="password" autoComplete="new-password" {...register('password')} />
        </FormField>
        <FormField
          label="Confirm password"
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
        <Button type="submit" className="w-full" isLoading={registerUser.isPending}>
          Create account
        </Button>
      </form>
    </div>
  );
}

export function RegisterPage() {
  const [email, setEmail] = useState<string | null>(null);

  if (!email) return <OtpStep onSent={setEmail} />;
  return <RegisterStep email={email} />;
}
