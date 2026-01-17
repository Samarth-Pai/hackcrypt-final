'use client';

import React, { useState } from 'react';
import Sidebar from './Sidebar';

interface DashboardShellProps {
    children: React.ReactNode;
    user: any;
}

export default function DashboardShell({ children, user }: DashboardShellProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="flex min-h-screen bg-teal-bg text-gray-100">
            <Sidebar
                user={user}
                isCollapsed={isCollapsed}
                toggleCollapse={() => setIsCollapsed(!isCollapsed)}
            />

            <main
                className={`transition-all duration-300 ease-in-out p-8 min-h-screen relative z-10 flex-1 ${isCollapsed ? 'ml-20' : 'ml-64'
                    }`}
            >
                {children}
            </main>
        </div>
    );
}
