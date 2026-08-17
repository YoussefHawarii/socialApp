import { z } from 'zod';

export const emailSchema = z.object({
  email: z.string().email('Enter a valid email address'),
});

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});
export type LoginFormValues = z.infer<typeof loginSchema>;

export const sendOtpSchema = emailSchema;
export type SendOtpFormValues = z.infer<typeof sendOtpSchema>;

export const registerSchema = z
  .object({
    email: z.string().email('Enter a valid email address'),
    otp: z.string().length(5, 'OTP must be exactly 5 characters'),
    userName: z.string().min(3, 'At least 3 characters').max(15, 'At most 15 characters'),
    password: z.string().min(6, 'At least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
export type RegisterFormValues = z.infer<typeof registerSchema>;

export const forgetPasswordSchema = emailSchema;
export type ForgetPasswordFormValues = z.infer<typeof forgetPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    email: z.string().email('Enter a valid email address'),
    otp: z.string().length(5, 'OTP must be exactly 5 characters'),
    password: z.string().min(6, 'At least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const googleLoginSchema = z.object({
  idToken: z.string().min(1, 'ID token is required'),
});
export type GoogleLoginFormValues = z.infer<typeof googleLoginSchema>;
