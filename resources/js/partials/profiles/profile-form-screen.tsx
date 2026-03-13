import { ProfilesForm } from '@/forms/profiles/profiles-form';
import { useProfilesForm } from '@/forms/profiles/use-profiles-form';
import type { Module } from '@/types';
import { router } from '@inertiajs/react';
import type { FormEvent } from 'react';

interface ProfileFormScreenProps {
    title: string;
    submitLabel: string;
    modules: Module[];
    initialValues: {
        name: string;
        modules?: number[];
    };
    method: 'post' | 'put';
    url: string;
}

export function ProfileFormScreen({ title, submitLabel, modules, initialValues, method, url }: ProfileFormScreenProps) {
    const { form, toggleModule } = useProfilesForm({
        name: initialValues.name,
        modules: initialValues.modules ?? [],
    });

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        form.submitWithValidation(method, url);
    };

    return (
        <ProfilesForm
            title={title}
            submitLabel={submitLabel}
            modules={modules}
            onCancel={() => router.get('/profiles')}
            onSubmit={handleSubmit}
            data={form.data}
            errors={form.errors}
            processing={form.processing}
            onChangeName={(value) => form.setData('name', value)}
            onToggleModule={toggleModule}
        />
    );
}
