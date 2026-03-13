import { ToastProvider } from '@/contexts/ToastProvider';
import type { MenuItem, SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, Shield, Users } from 'lucide-react';
import type { ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    title?: string;
}

export default function AppLayout({ children, title }: AppLayoutProps) {
    const { app, menus } = usePage<SharedData>().props;

    const iconMap: Record<string, (props: { className?: string }) => JSX.Element> = {
        'layout-dashboard': (props) => <LayoutDashboard {...props} />,
        shield: (props) => <Shield {...props} />,
        users: (props) => <Users {...props} />,
    };

    const menuItems: MenuItem[] = (menus ?? []).slice().sort((a, b) => (a.item_order ?? 0) - (b.item_order ?? 0));

    return (
        <ToastProvider>
            <Head title={title} />
            <div className="flex min-h-screen bg-gray-50">
                <aside className="w-64 overflow-y-auto bg-blue-assefaz text-white">
                    <div className="p-6">
                        <h1 className="text-lg font-bold text-white">{app?.name || 'ARK Core'}</h1>
                    </div>
                    <nav className="px-3">
                        {menuItems.length === 0 ? (
                            <span className="block px-3 py-2 text-xs uppercase tracking-wide text-white/50">Sem modulos</span>
                        ) : (
                            menuItems.map((item) => {
                                const Icon = item.icon ? iconMap[item.icon] : undefined;

                                return (
                                    <Link
                                        key={item.slug}
                                        href={item.path}
                                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white"
                                    >
                                        {Icon ? <Icon className="h-4 w-4" /> : <span className="h-4 w-4 rounded-full bg-white/30" />}
                                        {item.name}
                                    </Link>
                                );
                            })
                        )}
                    </nav>
                </aside>
                <main className="flex-1 p-8">{children}</main>
            </div>
        </ToastProvider>
    );
}
