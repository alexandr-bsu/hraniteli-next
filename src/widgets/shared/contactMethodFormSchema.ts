import { z } from 'zod';
import { CONTACT_METHOD_TYPES } from '@/widgets/shared/contactMethodConfig';

export const contactMethodFormSchema = z.object({
  contactType: z.enum(CONTACT_METHOD_TYPES),
  contact: z
    .string()
    .trim()
    .min(1, 'Заполните контакт для связи'),
});

export type ContactMethodFormValues = z.infer<typeof contactMethodFormSchema>;
