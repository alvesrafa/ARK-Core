import { useFormWithZod } from '@/hooks/use-form-with-zod';
import { profileSchema, type ProfileFormValues } from './schema';

export function useProfilesForm(initialValues: ProfileFormValues) {
    const form = useFormWithZod({
        schema: profileSchema,
        initialValues,
    });

    const toggleModule = (moduleId: number, checked: boolean) => {
        const modules = form.data.modules ?? [];
        const next = checked ? [...modules, moduleId] : modules.filter((id) => id !== moduleId);
        form.setData('modules', Array.from(new Set(next)));
    };

    return {
        form,
        toggleModule,
    };
}
