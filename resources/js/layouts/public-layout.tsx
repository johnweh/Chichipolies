import { ArrowUpRight, Moon, SignOut, Sun } from '@phosphor-icons/react';
import { Link, usePage } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import BottomNav from '@/components/bottom-nav';
import { useAppearance } from '@/hooks/use-appearance';

export default function PublicLayout({ children }: PropsWithChildren) {
    const { props, url } = usePage<{ auth: { user: { name: string; is_admin?: boolean } | null } }>();
    const { auth } = props;
    const { appearance, updateAppearance } = useAppearance();
    const path = url.split('?')[0];
    const dark =
        appearance === 'dark' ||
        (appearance === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    const navLink = (href: string, label: string) => (
        <Link
            href={href}
            className={`rounded-full px-3 py-1.5 transition-colors duration-300 ease-fluid ${
                path === href ? 'bg-secondary font-semibold text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
        >
            {label}
        </Link>
    );

    return (
        <div className="min-h-[100dvh] bg-background pb-20 sm:pb-0">
            <header className="fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:pt-5">
                <div className="mx-auto flex w-full max-w-2xl items-center gap-1 rounded-full border border-border/70 bg-card/80 py-1.5 pr-1.5 pl-4 shadow-[0_8px_30px_-12px_hsl(30,20%,20%,0.18)] backdrop-blur-xl">
                    <Link href="/" className="font-display text-lg font-semibold tracking-tight text-foreground">
                        Chichipolies
                    </Link>
                    <nav className="ml-auto hidden items-center text-sm sm:flex">
                        {navLink('/', 'Feed')}
                        {navLink('/about', 'About')}
                        {auth.user?.is_admin && navLink('/admin', 'Admin')}
                    </nav>
                    <button
                        onClick={() => updateAppearance(dark ? 'light' : 'dark')}
                        aria-label="Toggle theme"
                        className="ml-auto flex size-9 items-center justify-center rounded-full text-muted-foreground transition-all duration-300 ease-fluid hover:bg-secondary hover:text-foreground active:scale-95 sm:ml-1"
                    >
                        {dark ? <Sun weight="light" className="size-[18px]" /> : <Moon weight="light" className="size-[18px]" />}
                    </button>
                    {auth.user ? (
                        <div className="flex items-center gap-1">
                            <Link
                                href="/submit"
                                className="group hidden items-center gap-2 rounded-full bg-primary py-1.5 pr-1.5 pl-4 text-sm font-semibold text-primary-foreground transition-all duration-300 ease-fluid hover:opacity-90 active:scale-[0.98] sm:flex"
                            >
                                Post a story
                                <span className="flex size-6 items-center justify-center rounded-full bg-primary-foreground/15 transition-transform duration-300 ease-fluid group-hover:translate-x-0.5 group-hover:-translate-y-px">
                                    <ArrowUpRight weight="bold" className="size-3" />
                                </span>
                            </Link>
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                aria-label="Sign out"
                                className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-all duration-300 ease-fluid hover:bg-secondary hover:text-foreground active:scale-95"
                            >
                                <SignOut weight="light" className="size-[18px]" />
                            </Link>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground transition-all duration-300 ease-fluid hover:opacity-90 active:scale-[0.98]"
                        >
                            Sign in
                        </Link>
                    )}
                </div>
            </header>

            <main className="mx-auto w-full max-w-2xl px-4 pt-24 pb-16 sm:pt-28">{children}</main>

            <footer className="hidden border-t border-border/60 sm:block">
                <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-8 text-xs text-muted-foreground">
                    <span className="font-display text-sm text-foreground">Chichipolies</span>
                    <div className="flex gap-5">
                        <Link href="/about" className="transition-colors hover:text-foreground">
                            About
                        </Link>
                        <Link href="/about" className="transition-colors hover:text-foreground">
                            Community guidelines
                        </Link>
                    </div>
                    <span>Liberia&rsquo;s community news</span>
                </div>
            </footer>

            <BottomNav />
        </div>
    );
}
