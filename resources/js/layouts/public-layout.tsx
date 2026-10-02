import BottomNav from '@/components/bottom-nav';
import BrandMark from '@/components/brand-mark';
import FlashToast from '@/components/flash-toast';
import { HeaderSearch, MobileHeaderSearch } from '@/components/header-search';
import SiteFooter from '@/components/site-footer';
import UserMenu from '@/components/user-menu';
import { useAppearance } from '@/hooks/use-appearance';
import { Link, usePage } from '@inertiajs/react';
import { Bell, Heart, MagnifyingGlass, Moon, Sun } from '@phosphor-icons/react';
import { useState, type PropsWithChildren } from 'react';

type LayoutProps = {
    auth: { user: { name: string; email?: string; is_admin?: boolean } | null };
    activityCount?: number | null;
};

export default function PublicLayout({ children }: PropsWithChildren) {
    const { props, url } = usePage<LayoutProps>();
    const { auth, activityCount } = props;
    const { appearance, updateAppearance } = useAppearance();
    const path = url.split('?')[0];
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
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
                {active && <span className="bg-nav-foreground/80 absolute inset-x-2 bottom-3 h-0.5 rounded-full" />}
            </Link>
        );
    };

    const iconLinkClass = (active: boolean) =>
        `relative rounded-full p-2.5 transition-colors ${
            active ? 'bg-nav-foreground/15 text-nav-foreground' : 'text-nav-foreground/70 hover:bg-nav-foreground/10 hover:text-nav-foreground'
        }`;

    return (
        <div className="bg-background min-h-[100dvh] pb-20 sm:pb-0">
            <header className="bg-nav text-nav-foreground sticky top-0 z-40">
                <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 sm:px-6">
                    <Link href="/" className="group flex shrink-0 items-center gap-2.5 py-4" aria-label="Chichipolies home">
                        <BrandMark variant="onNav" className="ease-fluid size-9 rounded-lg transition-transform duration-300 group-hover:scale-105" />
                        <span className="hidden text-lg font-semibold tracking-tight sm:inline">Chichipolies</span>
                    </Link>

                    <nav className="hidden items-center xl:flex">
                        {navLink('/', 'Feed')}
                        {navLink('/search', 'Search')}
                        {navLink('/about', 'About')}
                        {auth.user && navLink('/submit', 'Submit')}
                    </nav>

                    <HeaderSearch />

                    <div className="ml-auto flex items-center gap-1 sm:gap-2">
                        <button
                            type="button"
                            aria-label="Search"
                            onClick={() => setMobileSearchOpen((open) => !open)}
                            className={`${iconLinkClass(path === '/search' || mobileSearchOpen)} lg:hidden`}
                        >
                            <MagnifyingGlass weight="light" className="size-5" />
                        </button>
                        <Link
                            href={auth.user ? '/saved' : '/login'}
                            aria-label="Saved stories"
                            className={`${iconLinkClass(path === '/saved')} hidden sm:flex`}
                        >
                            <Heart weight="light" className="size-5" />
                        </Link>
                        <Link
                            href={auth.user ? '/notifications' : '/login'}
                            aria-label="Notifications"
                            className={`${iconLinkClass(path === '/notifications')} hidden sm:flex`}
                        >
                            <Bell weight="light" className="size-5" />
                            {auth.user && activityCount != null && activityCount > 0 && (
                                <span className="bg-nav-foreground text-nav absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full text-[10px] font-bold">
                                    {activityCount > 9 ? '9+' : activityCount}
                                </span>
                            )}
                        </Link>
                        <button onClick={() => updateAppearance(dark ? 'light' : 'dark')} aria-label="Toggle theme" className={iconLinkClass(false)}>
                            {dark ? <Sun weight="light" className="size-5" /> : <Moon weight="light" className="size-5" />}
                        </button>
                        {auth.user ? (
                            <UserMenu user={auth.user} />
                        ) : (
                            <Link
                                href="/login"
                                className="bg-nav-foreground text-nav ml-1 rounded-full px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-90"
                            >
                                Sign in
                            </Link>
                        )}
                    </div>
                </div>
                <MobileHeaderSearch open={mobileSearchOpen} onClose={() => setMobileSearchOpen(false)} />
            </header>

            <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>

            <SiteFooter />

            <BottomNav />
            <FlashToast />
        </div>
    );
}
