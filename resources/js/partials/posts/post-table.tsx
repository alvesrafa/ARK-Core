import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import type { Post } from '@/types';

interface PostTableProps {
    posts: Post[];
    onDelete: (id: number) => void;
}

const statusVariant: Record<string, 'default' | 'success' | 'secondary'> = {
    draft: 'secondary',
    published: 'success',
    archived: 'default',
};

const statusLabel: Record<string, string> = {
    draft: 'Rascunho',
    published: 'Publicado',
    archived: 'Arquivado',
};

export function PostTable({ posts, onDelete }: PostTableProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Publicado em</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {posts.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center text-gray-500">
                            Nenhum post encontrado.
                        </TableCell>
                    </TableRow>
                ) : (
                    posts.map((post) => (
                        <TableRow key={post.id}>
                            <TableCell className="font-medium">{post.title}</TableCell>
                            <TableCell>
                                <Badge variant={statusVariant[post.status] || 'secondary'}>
                                    {statusLabel[post.status] || post.status}
                                </Badge>
                            </TableCell>
                            <TableCell>{formatDate(post.published_at)}</TableCell>
                            <TableCell>{formatDate(post.created_at)}</TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-1">
                                    <Button variant="ghost" size="icon" asChild>
                                        <Link href={`/posts/${post.id}`}>
                                            <Eye className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button variant="ghost" size="icon" asChild>
                                        <Link href={`/posts/${post.id}/edit`}>
                                            <Pencil className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => onDelete(post.id)}>
                                        <Trash2 className="h-4 w-4 text-red-600" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );
}
