import { Bell, Heart, MagnifyingGlass, Moon, Sun } from '@phosphor-icons/react';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import BottomNav from '@/components/bottom-nav';
import BrandMark from '@/components/brand-mark';
import FlashToast from '@/components/flash-toast';
import SiteFooter from '@/components/site-footer';
import UserMenu from '@/components/user-menu';
import { useAppearance } from '@/hooks/use-appearance';

export default function PublicLayout({ children }: PropsWithChildren) {
    const { props, url } = usePage<{ auth: { user: { name: string; email?: string; is_admin?: boolean } | null } }>();
    const { auth } = props;
    const { appearance, updateAppearance } = useAppearance();
    const path = url.split('?')[0];
    const dark =
        appearance === 'dark' ||
        (appearance === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    const navLink = (href: string, label: string) => {
        const active = path === href;

        return (
            <Link
                href={href}
                className={`relative px-4 py-5 text-sm font-medium transition-colors ${
                    active ? 'text-nav-foreground' : 'text-nav-foreground/70 hover:text-nav-foreground'
                }`}
            >
                {label}
                {active && <span className="absolute inset-x-2 bottom-3 h-0.5 rounded-full bg-nav-foreground/80" />}
            </Link>
        );
    };

    return (
        <div className="min-h-[100dvh] bg-background pb-20 sm:pb-0">
            <header className="sticky top-0 z-40 bg-nav text-nav-foreground">
                <div className="mx-auto flex max-w-7xl items-center px-4 sm:px-6">
                    <Link href="/" className="group flex shrink-0 items-center gap-2.5 py-4" aria-label="Chichipolies home">
                        <BrandMark variant="onNav" className="size-9 rounded-lg transition-transform duration-300 ease-fluid group-hover:scale-105" />
                        <span className="text-lg font-semibold tracking-tight">Chichipolies</span>
                    </Link>

                    <nav className="mx-auto hidden items-center lg:flex">
                        {navLink('/', 'Feed')}
                        {navLink('/about', 'About')}
                        {auth.user && navLink('/submit', 'Submit')}
                    </nav>

                    <div className="ml-auto flex items-center gap-1 sm:gap-2">
                        <button
                            type="button"
                            aria-label="Search"
                            className="hidden rounded-full p-2.5 text-nav-foreground/70 transition-colors hover:bg-nav-foreground/10 hover:text-nav-foreground sm:flex"
                        >
                            <MagnifyingGlass weight="light" className="size-5" />
                        </button>
                        <button
                            type="button"
                            aria-label="Favorites"
                            className="hidden rounded-full p-2.5 text-nav-foreground/70 transition-colors hover:bg-nav-foreground/10 hover:text-nav-foreground sm:flex"
                        >
                            <Heart weight="light" className="size-5" />
                        </button>
                        <button
                            type="button"
                            aria-label="Notifications"
                            className="hidden rounded-full p-2.5 text-nav-foreground/70 transition-colors hover:bg-nav-foreground/10 hover:text-nav-foreground sm:flex"
                        >
                            <Bell weight="light" className="size-5" />
                        </button>
                        <button
                            onClick={() => updateAppearance(dark ? 'light' : 'dark')}
                            aria-label="Toggle theme"
                            className="rounded-full p-2.5 text-nav-foreground/70 transition-colors hover:bg-nav-foreground/10 hover:text-nav-foreground"
                        >
                            {dark ? <Sun weight="light" className="size-5" /> : <Moon weight="light" className="size-5" />}
                        </button>
                        {auth.user ? (
                            <UserMenu user={auth.user} />
                        ) : (
                            <Link
                                href="/login"
                                className="ml-1 rounded-full bg-nav-foreground px-4 py-2 text-sm font-semibold text-nav transition-opacity hover:opacity-90"
                            >
                                Sign in
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>

            <SiteFooter />

            <BottomNav />
            <FlashToast />
        </div>
    );
}
