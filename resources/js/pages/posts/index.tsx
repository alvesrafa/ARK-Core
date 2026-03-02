import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import AppLayout from '@/layouts/AppLayout';
import { PostTable } from '@/partials/posts/post-table';
import { useDebounce } from '@/hooks/use-debounce';
import { Link, router } from '@inertiajs/react';
import { Plus, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { IPaginate, Post } from '@/types';

interface Props {
    posts: IPaginate<Post>;
    filters: {
        search?: string;
    };
}

export default function PostsIndex({ posts, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const debouncedSearch = useDebounce(search, 300);

    useEffect(() => {
        if (debouncedSearch !== (filters.search || '')) {
            router.get('/posts', { search: debouncedSearch || undefined }, { preserveState: true, preserveScroll: true });
        }
    }, [debouncedSearch]);

    const handleDelete = (id: number) => {
        if (confirm('Tem certeza que deseja excluir este post?')) {
            router.delete(`/posts/${id}`, { preserveScroll: true });
        }
    };

    return (
        <AppLayout title="Posts">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold tracking-tight">Posts</h2>
                    <Button asChild>
                        <Link href="/posts/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Novo Post
                        </Link>
                    </Button>
                </div>

                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                        placeholder="Buscar posts..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>

                <div className="rounded-lg border bg-white">
                    <PostTable posts={posts.data} onDelete={handleDelete} />
                </div>

                <Pagination paginator={posts} />
            </div>
        </AppLayout>
    );
}
