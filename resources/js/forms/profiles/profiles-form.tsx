import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Module } from '@/types';
import type { FormEvent } from 'react';

interface ProfilesFormProps {
    title: string;
    submitLabel: string;
    modules: Module[];
    onCancel?: () => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    data: {
        name: string;
        modules?: number[];
    };
    errors: Partial<Record<string, string>>;
    processing: boolean;
    onChangeName: (value: string) => void;
    onToggleModule: (moduleId: number, checked: boolean) => void;
}

export function ProfilesForm({
    title,
    submitLabel,
    modules,
    onCancel,
    onSubmit,
    data,
    errors,
    processing,
    onChangeName,
    onToggleModule,
}: ProfilesFormProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
                    <p className="text-sm text-gray-500">Defina o nome do perfil e os modulos permitidos.</p>
                </div>
                <div className="flex items-center gap-3">
                    {onCancel ? (
                        <Button type="button" variant="outline" onClick={onCancel}>
                            Voltar
                        </Button>
                    ) : null}
                    <Button type="submit" disabled={processing}>
                        {submitLabel}
                    </Button>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="profile-name">Nome do perfil</Label>
                <Input
                    id="profile-name"
                    value={data.name}
                    onChange={(event) => onChangeName(event.target.value)}
                    placeholder="Digite o nome do perfil"
                />
                {errors.name ? <p className="text-sm text-red-600">{errors.name}</p> : null}
            </div>

            <div className="rounded-lg border border-gray-200">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Modulo</TableHead>
                            <TableHead className="w-28 text-center">Acesso</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {modules.map((module) => {
                            const checked = Boolean(data.modules?.includes(module.id));

                            return (
                                <TableRow key={module.id}>
                                    <TableCell className="font-medium text-gray-900">{module.name}</TableCell>
                                    <TableCell className="text-center">
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={(event) => onToggleModule(module.id, event.target.checked)}
                                            className="h-4 w-4 rounded border-gray-300 text-blue-assefaz focus:ring-blue-assefaz"
                                        />
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
            {errors.modules ? <p className="text-sm text-red-600">{errors.modules}</p> : null}
        </form>
    );
}
