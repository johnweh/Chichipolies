import { Link, usePage } from '@inertiajs/react';
import { type ReactNode } from 'react';

interface SharedProps {
    auth: { user: { name: string } | null };
    categories: string[];
    counties: string[];
}

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
    return (
        <div>
            <p className="text-[11px] font-semibold tracking-[0.12em] text-nav-foreground/50 uppercase">{title}</p>
            <nav className="mt-4 flex flex-col gap-2">{children}</nav>
        </div>
    );
}

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
    return (
        <Link href={href} className="text-sm text-nav-foreground/75 transition-colors hover:text-nav-foreground">
            {children}
        </Link>
    );
}

export default function SiteFooter() {
    const { auth, categories, counties } = usePage<SharedProps>().props;
    const year = new Date().getFullYear();

    return (
        <footer className="mt-8 hidden bg-nav text-nav-foreground sm:block">
            <div className="mx-auto max-w-7xl px-6 py-12">
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
                    <FooterColumn title="Categories">
                        {categories.map((category) => (
                            <FooterLink key={category} href={`/?category=${encodeURIComponent(category)}`}>
                                {category}
                            </FooterLink>
                        ))}
                    </FooterColumn>

                    <FooterColumn title="Counties">
                        {counties.map((county) => (
                            <FooterLink key={county} href={`/?county=${encodeURIComponent(county)}`}>
                                {county}
                            </FooterLink>
                        ))}
                    </FooterColumn>

                    <FooterColumn title="Platform">
                        <FooterLink href="/">Feed</FooterLink>
                        <FooterLink href="/search">Search</FooterLink>
                        <FooterLink href="/about">About</FooterLink>
                        <FooterLink href="/submit">Submit a story</FooterLink>
                        <FooterLink href="/?tab=verified">Verified stories</FooterLink>
                        <FooterLink href="/?tab=active">Active discussions</FooterLink>
                        {auth.user && (
                            <>
                                <FooterLink href="/saved">Saved stories</FooterLink>
                                <FooterLink href="/notifications">Notifications</FooterLink>
                            </>
                        )}
                    </FooterColumn>

                    <FooterColumn title="Policies">
                        <FooterLink href="/privacy">Privacy policy</FooterLink>
                        <FooterLink href="/terms">Terms of service</FooterLink>
                        <FooterLink href="/guidelines">Community guidelines</FooterLink>
                    </FooterColumn>

                    <FooterColumn title="Account">
                        {auth.user ? (
                            <>
                                <FooterLink href="/settings/profile">Settings</FooterLink>
                                <FooterLink href="/submit">Post a story</FooterLink>
                                <FooterLink href="/saved">Saved stories</FooterLink>
                                <FooterLink href="/notifications">Notifications</FooterLink>
                            </>
                        ) : (
                            <>
                                <FooterLink href="/login">Sign in</FooterLink>
                                <FooterLink href="/register">Create account</FooterLink>
                            </>
                        )}
                    </FooterColumn>
                </div>

                <p className="mt-10 text-xs text-nav-foreground/50">&copy; {year} Chichipolies. All rights reserved.</p>
            </div>
        </footer>
    );
}
