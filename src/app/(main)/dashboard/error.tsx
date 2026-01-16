'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-[#ededed]">
            <h2 className="text-2xl font-bold mb-4 text-red-400">Something went wrong!</h2>
            <p className="mb-6 text-gray-400 max-w-md text-center">
                {error.message || "We couldn't load the dashboard data. Please check your connection."}
            </p>
            <button
                onClick={() => reset()}
                className="px-6 py-2 bg-[#2E7D32] hover:bg-[#1B5E20] text-white rounded-full transition-colors font-bold"
            >
                Try again
            </button>
        </div>
    );
}
