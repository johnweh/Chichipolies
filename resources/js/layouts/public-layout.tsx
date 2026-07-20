import { Link, usePage } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import BottomNav from '@/components/bottom-nav';
import { useAppearance } from '@/hooks/use-appearance';

export default function PublicLayout({ children }: PropsWithChildren) {
    const { props } = usePage<{ auth: { user: { name: string; is_admin?: boolean } | null } }>();
    const { auth } = props;
    const { appearance, updateAppearance } = useAppearance();
    const dark =
        appearance === 'dark' ||
        (appearance === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    return (
        <div className="min-h-screen bg-gray-50 pb-16 sm:pb-0 dark:bg-gray-950">
            <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/90 backdrop-blur dark:border-gray-800 dark:bg-gray-900/90">
                <div className="mx-auto flex max-w-2xl items-center gap-4 px-4 py-3">
                    <Link href="/" className="text-lg font-extrabold text-blue-900 dark:text-blue-300">
                        Chichipolies
                    </Link>
                    <nav className="ml-auto hidden items-center gap-4 text-sm sm:flex">
                        <Link href="/" className="hover:text-blue-900">
                            Feed
                        </Link>
                        <Link href="/submit" className="hover:text-blue-900">
                            Post a Story
                        </Link>
                        <Link href="/about" className="hover:text-blue-900">
                            About
                        </Link>
                        {auth.user?.is_admin && (
                            <Link href="/admin" className="hover:text-blue-900">
                                Admin
                            </Link>
                        )}
                    </nav>
                    <button
                        onClick={() => updateAppearance(dark ? 'light' : 'dark')}
                        aria-label="Toggle theme"
                        className="ml-auto text-lg sm:ml-0"
                    >
                        {dark ? '☀️' : '🌙'}
                    </button>
                    {auth.user ? (
                        <Link href={route('logout')} method="post" as="button" className="text-sm text-gray-500">
                            Sign out
                        </Link>
                    ) : (
                        <Link href="/login" className="rounded-lg bg-blue-900 px-3 py-1.5 text-sm font-medium text-white">
                            Sign In
                        </Link>
                    )}
                </div>
            </header>
            <main className="mx-auto max-w-2xl px-4 py-6">{children}</main>
            <BottomNav />
        </div>
    );
}
