import AppLayout from '@/pages/layouts/AppLayout';
import { ProfilesList } from '@/partials/profiles/profiles-list';
import type { Profile } from '@/types';

interface ProfilesPageProps {
    profiles: Profile[];
}

export default function ProfilesPage({ profiles }: ProfilesPageProps) {
    return (
        <AppLayout title="Perfis">
            <ProfilesList profiles={profiles} />
        </AppLayout>
    );
}
