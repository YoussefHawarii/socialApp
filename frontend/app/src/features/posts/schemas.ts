import { z } from 'zod';

export const postFormSchema = z
  .object({
    text: z.string().min(2, 'At least 2 characters').or(z.literal('')),
    images: z.array(z.instanceof(File)),
  })
  .refine((data) => data.text.length >= 2 || data.images.length > 0, {
    message: 'Add some text or at least one image',
    path: ['text'],
  });
export type PostFormValues = z.infer<typeof postFormSchema>;
