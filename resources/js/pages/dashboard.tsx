import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, LayoutDashboard } from 'lucide-react';
import AppLayout from './layouts/AppLayout';

export default function Dashboard() {
    return (
        <AppLayout title="Dashboard">
            <div className="space-y-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                    <p className="text-gray-500">Bem-vindo ao ARK Core.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Posts</CardTitle>
                            <FileText className="h-4 w-4 text-gray-500" />
                        </CardHeader>
                        <CardContent>
                            <CardDescription>Gerencie os posts do sistema.</CardDescription>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Template</CardTitle>
                            <LayoutDashboard className="h-4 w-4 text-gray-500" />
                        </CardHeader>
                        <CardContent>
                            <CardDescription>Este é o template padrão ARK Core.</CardDescription>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
