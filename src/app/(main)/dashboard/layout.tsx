import Sidebar from '@/components/layout/Sidebar';
import PageTransition from '@/components/layout/PageTransition';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-teal-bg text-gray-100">
            <Sidebar />
            <main className="ml-64 p-8 min-h-screen relative z-10">
                <PageTransition>
                    {children}
                </PageTransition>
            </main>
        </div>
    );
}
