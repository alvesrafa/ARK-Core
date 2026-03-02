import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PostForm } from '@/forms/posts/post-form';
import { usePostForm } from '@/forms/posts/use-post-form';
import AppLayout from '@/layouts/AppLayout';

interface Props {
    statuses: Record<string, string>;
}

export default function PostsCreate({ statuses }: Props) {
    const form = usePostForm();

    return (
        <AppLayout title="Novo Post">
            <div className="mx-auto max-w-2xl space-y-6">
                <h2 className="text-3xl font-bold tracking-tight">Novo Post</h2>

                <Card>
                    <CardHeader>
                        <CardTitle>Dados do Post</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <PostForm form={form} statuses={statuses} onSubmit={form.submitCreate} submitLabel="Criar Post" />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
