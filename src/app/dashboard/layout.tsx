import Sidebar from '@/components/layout/Sidebar';
import PageTransition from '@/components/layout/PageTransition';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#3E2723] text-[#ededed]">
            <Sidebar />
            <main className="ml-64 p-8 min-h-screen bg-[#3E2723] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#4E342E] via-[#3E2723] to-[#2E1E1A]">
                <PageTransition>
                    {children}
                </PageTransition>
            </main>
        </div>
    );
}
