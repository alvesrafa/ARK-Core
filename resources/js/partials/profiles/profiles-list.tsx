import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Profile } from '@/types';
import { Link, router } from '@inertiajs/react';

interface ProfilesListProps {
    profiles: Profile[];
}

export function ProfilesList({ profiles }: ProfilesListProps) {
    const handleDelete = (profileId: number) => {
        if (!confirm('Deseja remover este perfil?')) return;
        router.delete(`/profiles/${profileId}`);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Perfis</h1>
                    <p className="text-sm text-gray-500">Gerencie os perfis e seus acessos.</p>
                </div>
                <Button asChild>
                    <Link href="/profiles/create">Novo perfil</Link>
                </Button>
            </div>

            <div className="rounded-lg border border-gray-200">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Modulos</TableHead>
                            <TableHead className="text-right">Acoes</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {profiles.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center text-sm text-gray-500">
                                    Nenhum perfil cadastrado.
                                </TableCell>
                            </TableRow>
                        ) : (
                            profiles.map((profile) => {
                                const moduleCount = profile.modules?.length ?? profile.modules_count ?? 0;

                                return (
                                    <TableRow key={profile.id}>
                                        <TableCell className="font-medium text-gray-900">{profile.name}</TableCell>
                                        <TableCell>{moduleCount}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`/profiles/${profile.id}/edit`}>Editar</Link>
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => handleDelete(profile.id)}>
                                                    Remover
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
