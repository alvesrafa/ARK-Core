import AppLayout from '@/pages/layouts/AppLayout';
import { ProfileFormScreen } from '@/partials/profiles/profile-form-screen';
import type { Module, Profile } from '@/types';

interface EditProfilePageProps {
    profile: Profile;
    modules: Module[];
}

export default function EditProfilePage({ profile, modules }: EditProfilePageProps) {
    const moduleIds = profile.modules?.map((module) => module.id) ?? [];

    return (
        <AppLayout title="Editar Perfil">
            <ProfileFormScreen
                title="Editar perfil"
                submitLabel="Salvar"
                modules={modules}
                initialValues={{ name: profile.name, modules: moduleIds }}
                method="put"
                url={`/profiles/${profile.id}`}
            />
        </AppLayout>
    );
}
