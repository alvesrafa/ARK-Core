import { ToastProvider } from '@/contexts/ToastProvider';
import type { SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { FileText, LayoutDashboard } from 'lucide-react';
import type { ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    title?: string;
}

export default function AppLayout({ children, title }: AppLayoutProps) {
    const { app } = usePage<{ app: SharedData['app'] }>().props;

    return (
        <ToastProvider>
            <Head title={title} />
            <div className="flex min-h-screen bg-gray-50">
                <aside className="w-64 border-r border-gray-200 bg-white">
                    <div className="p-6">
                        <h1 className="text-lg font-bold text-gray-900">{app?.name || 'ARK Core'}</h1>
                    </div>
                    <nav className="px-3">
                        <Link
                            href="/"
                            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                        >
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                        </Link>
                        <Link
                            href="/posts"
                            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                        >
                            <FileText className="h-4 w-4" />
                            Posts
                        </Link>
                    </nav>
                </aside>
                <main className="flex-1 p-8">{children}</main>
            </div>
        </ToastProvider>
    );
}
