import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { IPaginate } from '@/types';

interface PaginationProps<T> {
    paginator: IPaginate<T>;
    className?: string;
}

export function Pagination<T>({ paginator, className }: PaginationProps<T>) {
    if (paginator.last_page <= 1) return null;

    return (
        <nav className={cn('flex items-center justify-between', className)}>
            <p className="text-sm text-gray-500">
                Mostrando {paginator.from} a {paginator.to} de {paginator.total} resultados
            </p>
            <div className="flex items-center gap-1">
                {paginator.links.map((link, index) => {
                    if (!link.url) {
                        return (
                            <span
                                key={index}
                                className="inline-flex h-9 items-center justify-center rounded-md px-3 text-sm text-gray-400"
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        );
                    }

                    return (
                        <Link
                            key={index}
                            href={link.url}
                            className={cn(
                                'inline-flex h-9 items-center justify-center rounded-md px-3 text-sm transition-colors',
                                link.active ? 'bg-gray-900 text-white' : 'hover:bg-gray-100',
                            )}
                            preserveState
                            preserveScroll
                        >
                            {link.label === '&laquo; Previous' ? (
                                <ChevronLeft className="h-4 w-4" />
                            ) : link.label === 'Next &raquo;' ? (
                                <ChevronRight className="h-4 w-4" />
                            ) : (
                                <span dangerouslySetInnerHTML={{ __html: link.label }} />
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
