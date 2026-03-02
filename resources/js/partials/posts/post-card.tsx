import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import type { Post } from '@/types';

interface PostCardProps {
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

export function PostCard({ post }: PostCardProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{post.title}</CardTitle>
                    <Badge variant={statusVariant[post.status] || 'secondary'}>
                        {statusLabel[post.status] || post.status}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <p className="line-clamp-3 text-sm text-gray-600">{post.content}</p>
                <div className="mt-4 flex gap-4 text-xs text-gray-400">
                    <span>Criado: {formatDate(post.created_at)}</span>
                    {post.published_at && <span>Publicado: {formatDate(post.published_at)}</span>}
                </div>
            </CardContent>
        </Card>
    );
}
