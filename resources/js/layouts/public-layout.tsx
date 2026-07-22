import { ArrowUpRight, Moon, Sun } from '@phosphor-icons/react';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState, type PropsWithChildren } from 'react';
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

    const sentinelRef = useRef<HTMLDivElement>(null);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;
        const observer = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting));
        observer.observe(sentinel);
        return () => observer.disconnect();
    }, []);

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
            <div ref={sentinelRef} aria-hidden className="absolute top-2 h-px w-px" />

            <header className="fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:pt-4">
                <div
                    className={`mx-auto flex w-full max-w-2xl items-center gap-1 rounded-full border bg-card/85 pr-1.5 pl-2 backdrop-blur-xl transition-all duration-500 ease-fluid ${
                        scrolled
                            ? 'border-border/80 py-1 shadow-[0_12px_40px_-12px_hsl(224,40%,25%,0.28)]'
                            : 'border-border/60 py-1.5 shadow-[0_8px_30px_-14px_hsl(224,30%,25%,0.16)]'
                    }`}
                >
                    <Link href="/" className="group flex items-center gap-2.5 pl-1" aria-label="Chichipolies home">
                        <BrandMark className="size-8 rounded-[0.65rem] transition-transform duration-300 ease-fluid group-hover:scale-105" />
                        <span className="font-display text-lg font-semibold tracking-tight text-foreground">Chichipolies</span>
                    </Link>

                    <nav className="ml-auto hidden items-center text-sm sm:flex">
                        {navLink('/', 'Feed')}
                        {navLink('/about', 'About')}
                    </nav>

                    <button
                        onClick={() => updateAppearance(dark ? 'light' : 'dark')}
                        aria-label="Toggle theme"
                        className="ml-auto flex size-9 items-center justify-center rounded-full text-muted-foreground transition-all duration-300 ease-fluid hover:bg-secondary hover:text-foreground active:scale-95 sm:ml-1"
                    >
                        {dark ? <Sun weight="light" className="size-[18px]" /> : <Moon weight="light" className="size-[18px]" />}
                    </button>

                    {auth.user ? (
                        <div className="flex items-center gap-1.5">
                            <Link
                                href="/submit"
                                className="group hidden items-center gap-2 rounded-full bg-primary py-1.5 pr-1.5 pl-4 text-sm font-semibold text-primary-foreground transition-all duration-300 ease-fluid hover:opacity-90 active:scale-[0.98] sm:flex"
                            >
                                Post a story
                                <span className="flex size-6 items-center justify-center rounded-full bg-primary-foreground/15 transition-transform duration-300 ease-fluid group-hover:translate-x-0.5 group-hover:-translate-y-px">
                                    <ArrowUpRight weight="bold" className="size-3" />
                                </span>
                            </Link>
                            <UserMenu user={auth.user} />
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
                    <span className="flex items-center gap-2">
                        <BrandMark className="size-5 rounded-md" charClass="text-[10px]" starClass="top-0.5 right-0.5 size-1" />
                        <span className="font-display text-sm text-foreground">Chichipolies</span>
                    </span>
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
            <FlashToast />
        </div>
    );
}
