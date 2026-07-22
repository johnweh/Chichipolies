import { Link, usePage } from '@inertiajs/react';
import Reveal from '@/components/reveal';
import AppLayout from '@/layouts/app-layout';
import PublicLayout from '@/layouts/public-layout';
import SettingsLayout from '@/layouts/settings/layout';
import type { BreadcrumbItem, SharedData } from '@/types';

const tabs = [
    { title: 'Profile', url: '/settings/profile' },
    { title: 'Password', url: '/settings/password' },
    { title: 'Appearance', url: '/settings/appearance' },
];

/**
 * Admins get the sidebar app chrome; everyone else gets the public feed chrome.
 */
export default function SettingsShell({ children, breadcrumbs }: { children: React.ReactNode; breadcrumbs?: BreadcrumbItem[] }) {
    const { auth } = usePage<SharedData>().props;
    const currentPath = usePage().url.split('?')[0];

    if (auth.user?.is_admin) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <SettingsLayout>{children}</SettingsLayout>
            </AppLayout>
        );
    }

    return (
        <PublicLayout>
            <Reveal>
                <span className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-[10px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                    Your account
                </span>
                <h1 className="font-display mt-4 text-3xl font-semibold tracking-tight text-foreground">Settings</h1>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Manage your profile and account settings.</p>
            </Reveal>

            <Reveal delay={100} className="mt-6">
                <div className="flex gap-1.5">
                    {tabs.map((tab) => (
                        <Link
                            key={tab.url}
                            href={tab.url}
                            prefetch
                            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-300 ease-fluid active:scale-[0.97] ${
                                currentPath === tab.url
                                    ? 'bg-primary font-semibold text-primary-foreground'
                                    : 'border border-input bg-card text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            {tab.title}
                        </Link>
                    ))}
                </div>
            </Reveal>

            <Reveal delay={160} className="mt-6">
                <div className="rounded-3xl bg-card p-6 shadow-soft ring-1 ring-border/60 sm:p-8">
                    <section className="max-w-xl space-y-12">{children}</section>
                </div>
            </Reveal>
        </PublicLayout>
    );
}
