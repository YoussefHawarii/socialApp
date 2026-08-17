import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateProfileSchema, type UpdateProfileFormValues } from '@/features/user/schemas';
import { useUpdateProfile } from '@/features/user/useProfileMutations';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';
import { Button } from '@/components/ui/Button';
import { ApiErrorAlert } from '@/components/shared/ApiErrorAlert';
import { toast } from '@/store/toast.store';
import type { User } from '@/types/user';

export function EditProfileForm({ user }: { user: User }) {
  const updateProfile = useUpdateProfile();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { userName: user.userName },
  });

  const onSubmit = (values: UpdateProfileFormValues) => {
    updateProfile.mutate(values, {
      onSuccess: () => toast.success('Profile updated'),
    });
  };

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)} noValidate>
      <h3 className="text-sm font-semibold text-gray-900">Edit profile</h3>
      {updateProfile.isError && <ApiErrorAlert error={updateProfile.error} />}
      <FormField label="Username" htmlFor="userName" error={errors.userName?.message}>
        <Input id="userName" {...register('userName')} />
      </FormField>
      <Button type="submit" isLoading={updateProfile.isPending} className="self-start">
        Save changes
      </Button>
    </form>
  );
}
