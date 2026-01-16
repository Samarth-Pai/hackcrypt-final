
import TopNav from '@/components/layout/TopNav';

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative z-10 flex flex-col min-h-screen">
            <TopNav />
            <main className="flex-grow">
                {children}
            </main>
        </div>
    );
}
