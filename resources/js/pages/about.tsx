import { Head } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';

export default function About() {
    return (
        <PublicLayout>
            <Head title="About" />
            <h1 className="text-2xl font-bold">About Chichipolies</h1>
            <div className="mt-4 space-y-4 text-sm text-gray-700 dark:text-gray-300">
                <p>
                    Chichipolies is Liberia&apos;s community-driven news platform. Citizens across all 15 counties
                    report what is happening around them — the community votes on whether each story is true,
                    keeping our news honest.
                </p>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Community Guidelines</h2>
                <ul className="list-disc space-y-1 pl-5">
                    <li>Report what you saw, not what you heard.</li>
                    <li>Vote honestly — only mark a story true if you have good reason to believe it.</li>
                    <li>No hate speech, no incitement, no personal attacks.</li>
                    <li>Report abuse. Our moderators review every report.</li>
                </ul>
            </div>
        </PublicLayout>
    );
}
