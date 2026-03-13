import { z } from 'zod';

export const profileSchema = z.object({
    name: z.string().min(2, 'Informe o nome do perfil.'),
    modules: z.array(z.number()).optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
