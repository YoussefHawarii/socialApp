import { z } from 'zod';

export const updateProfileSchema = z.object({
  userName: z.string().min(3, 'At least 3 characters').max(15, 'At most 15 characters'),
});
export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, 'Current password is required'),
    password: z.string().min(6, 'At least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine((data) => data.password !== data.oldPassword, {
    message: 'New password must be different from the current password',
    path: ['password'],
  });
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export const updateEmailSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required to confirm this change'),
});
export type UpdateEmailFormValues = z.infer<typeof updateEmailSchema>;
