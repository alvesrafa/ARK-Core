import AppLayout from '@/pages/layouts/AppLayout';
import { ProfileFormScreen } from '@/partials/profiles/profile-form-screen';
import type { Module } from '@/types';

interface CreateProfilePageProps {
    modules: Module[];
}

export default function CreateProfilePage({ modules }: CreateProfilePageProps) {
    return (
        <AppLayout title="Criar Perfil">
            <ProfileFormScreen
                title="Criar perfil"
                submitLabel="Criar"
                modules={modules}
                initialValues={{ name: '', modules: [] }}
                method="post"
                url="/profiles"
            />
        </AppLayout>
    );
}
