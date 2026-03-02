import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import AppLayout from '@/layouts/AppLayout';
import { Link, router } from '@inertiajs/react';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import type { Post } from '@/types';

interface Props {
    post: Post;
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

export default function PostsShow({ post }: Props) {
    const handleDelete = () => {
        if (confirm('Tem certeza que deseja excluir este post?')) {
            router.delete(`/posts/${post.id}`);
        }
    };

    return (
        <AppLayout title={post.title}>
            <div className="mx-auto max-w-3xl space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/posts">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h2 className="flex-1 text-3xl font-bold tracking-tight">{post.title}</h2>
                    <Badge variant={statusVariant[post.status] || 'secondary'}>
                        {statusLabel[post.status] || post.status}
                    </Badge>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Conteúdo</CardTitle>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`/posts/${post.id}/edit`}>
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Editar
                                    </Link>
                                </Button>
                                <Button variant="destructive" size="sm" onClick={handleDelete}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Excluir
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="prose max-w-none whitespace-pre-wrap">{post.content}</div>
                        <div className="mt-6 flex gap-4 border-t pt-4 text-sm text-gray-500">
                            <span>Criado em: {formatDate(post.created_at)}</span>
                            {post.published_at && <span>Publicado em: {formatDate(post.published_at)}</span>}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
