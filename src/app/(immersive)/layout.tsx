import { getUserProfile } from '@/lib/user';
import DashboardShell from '@/components/layout/DashboardShell';
import PageTransition from '@/components/layout/PageTransition';

export default async function ImmersiveLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getUserProfile();

    return (
        <DashboardShell user={JSON.parse(JSON.stringify(user))}>
            <PageTransition>
                {children}
            </PageTransition>
        </DashboardShell>
    );
}
