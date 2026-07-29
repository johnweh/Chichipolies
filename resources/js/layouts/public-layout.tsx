import { Bell, Heart, MagnifyingGlass, Moon, Sun } from '@phosphor-icons/react';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import BottomNav from '@/components/bottom-nav';
import BrandMark from '@/components/brand-mark';
import FlashToast from '@/components/flash-toast';
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
    const year = new Date().getFullYear();

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

    const footerLink = (href: string, label: string) => (
        <Link href={href} className="text-sm text-nav-foreground/75 transition-colors hover:text-nav-foreground">
            {label}
        </Link>
    );

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

            <footer className="mt-8 hidden bg-nav text-nav-foreground sm:block">
                <div className="mx-auto max-w-7xl px-6 py-12">
                    <div className="grid gap-10 sm:grid-cols-[1.5fr_1fr_1fr]">
                        <div className="space-y-4">
                            <Link href="/" className="group inline-flex items-center gap-2.5" aria-label="Chichipolies home">
                                <BrandMark variant="onNav" className="size-9 rounded-lg transition-transform duration-300 ease-fluid group-hover:scale-105" />
                                <span className="text-lg font-semibold tracking-tight">Chichipolies</span>
                            </Link>
                            <p className="max-w-sm text-sm leading-relaxed text-nav-foreground/70">
                                Liberia&rsquo;s community-driven news platform. Citizens report what is happening across all 15
                                counties, and the community verifies what is true.
                            </p>
                        </div>

                        <div>
                            <p className="text-[11px] font-semibold tracking-[0.12em] text-nav-foreground/50 uppercase">Explore</p>
                            <nav className="mt-4 flex flex-col gap-2.5">
                                {footerLink('/', 'Feed')}
                                {footerLink('/about', 'About')}
                                {footerLink('/submit', 'Submit a story')}
                            </nav>
                        </div>

                        <div>
                            <p className="text-[11px] font-semibold tracking-[0.12em] text-nav-foreground/50 uppercase">Community</p>
                            <nav className="mt-4 flex flex-col gap-2.5">
                                {footerLink('/about', 'Community guidelines')}
                                {footerLink('/login', 'Sign in')}
                                {footerLink('/register', 'Create account')}
                            </nav>
                        </div>
                    </div>

                    <p className="mt-10 text-xs text-nav-foreground/50">&copy; {year} Chichipolies. All rights reserved.</p>
                </div>
            </footer>

            <BottomNav />
            <FlashToast />
        </div>
    );
}
