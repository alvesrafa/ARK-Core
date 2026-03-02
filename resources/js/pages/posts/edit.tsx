import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PostForm } from '@/forms/posts/post-form';
import { usePostForm } from '@/forms/posts/use-post-form';
import AppLayout from '@/layouts/AppLayout';
import type { Post } from '@/types';

interface Props {
    post: Post;
    statuses: Record<string, string>;
}

export default function PostsEdit({ post, statuses }: Props) {
    const form = usePostForm({
        initialValues: {
            title: post.title,
            content: post.content,
            status: post.status as 'draft' | 'published' | 'archived',
        },
    });

    return (
        <AppLayout title="Editar Post">
            <div className="mx-auto max-w-2xl space-y-6">
                <h2 className="text-3xl font-bold tracking-tight">Editar Post</h2>

                <Card>
                    <CardHeader>
                        <CardTitle>Dados do Post</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <PostForm
                            form={form}
                            statuses={statuses}
                            onSubmit={() => form.submitUpdate(post.id)}
                            submitLabel="Salvar Alterações"
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
