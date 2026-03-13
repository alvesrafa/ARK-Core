import { useForm, type InertiaFormProps } from '@inertiajs/react';
import type { ZodType, ZodError } from 'zod';
import { useCallback } from 'react';

type FormValues = Record<string, string | number | boolean | null | undefined | Array<string | number | boolean>>;

interface UseFormWithZodReturn<T extends FormValues> extends InertiaFormProps<T> {
    validate: () => boolean;
    submitWithValidation: (method: 'post' | 'put' | 'patch' | 'delete', url: string) => void;
}

export function useFormWithZod<T extends FormValues>({
    schema,
    initialValues,
}: {
    schema: ZodType<T>;
    initialValues: T;
}): UseFormWithZodReturn<T> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const form = useForm(initialValues as any);

    const validate = useCallback((): boolean => {
        const result = schema.safeParse(form.data);

        if (!result.success) {
            const zodError = result.error as ZodError;
            const errors: Record<string, string> = {};

            for (const issue of zodError.issues) {
                const key = issue.path.join('.');
                if (!errors[key]) {
                    errors[key] = issue.message;
                }
            }

            form.clearErrors();
            for (const [key, message] of Object.entries(errors)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                form.setError(key as any, message);
            }

            return false;
        }

        form.clearErrors();
        return true;
    }, [form, schema]);

    const submitWithValidation = useCallback(
        (method: 'post' | 'put' | 'patch' | 'delete', url: string) => {
            if (!validate()) return;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (form[method] as any)(url);
        },
        [form, validate],
    );

    return {
        ...(form as unknown as InertiaFormProps<T>),
        validate,
        submitWithValidation,
    };
}
