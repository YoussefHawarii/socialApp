import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateEmailSchema, type UpdateEmailFormValues } from '@/features/user/schemas';
import { useUpdateEmail } from '@/features/user/useProfileMutations';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { ApiErrorAlert } from '@/components/shared/ApiErrorAlert';

export function UpdateEmailForm() {
  const updateEmail = useUpdateEmail();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateEmailFormValues>({ resolver: zodResolver(updateEmailSchema) });

  const onSubmit = (values: UpdateEmailFormValues) => {
    updateEmail.mutate(values, { onSuccess: () => reset() });
  };

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)} noValidate>
      <h3 className="text-sm font-semibold text-gray-900">Update email</h3>
      {updateEmail.isError && <ApiErrorAlert error={updateEmail.error} />}
      {updateEmail.isSuccess && (
        <Alert variant="success">
          A verification link was sent to your new email. Your email won&apos;t change until you
          click it.
        </Alert>
      )}
      <FormField label="New email" htmlFor="newEmail" error={errors.email?.message}>
        <Input id="newEmail" type="email" {...register('email')} />
      </FormField>
      <FormField label="Current password" htmlFor="confirmPasswordForEmail" error={errors.password?.message}>
        <Input
          id="confirmPasswordForEmail"
          type="password"
          autoComplete="current-password"
          {...register('password')}
        />
      </FormField>
      <Button type="submit" isLoading={updateEmail.isPending} className="self-start">
        Send verification email
      </Button>
    </form>
  );
}
