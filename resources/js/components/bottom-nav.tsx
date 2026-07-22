import { Info, Newspaper, PenNib, ShieldCheck } from '@phosphor-icons/react';
import { Link, usePage } from '@inertiajs/react';

export default function BottomNav() {
    const { props, url } = usePage<{ auth: { user: { is_admin?: boolean } | null } }>();
    const { auth } = props;
    const path = url.split('?')[0];

    const items = [
        { href: '/', label: 'Feed', Icon: Newspaper },
        { href: '/submit', label: 'Post', Icon: PenNib },
        { href: '/about', label: 'About', Icon: Info },
        ...(auth.user?.is_admin ? [{ href: '/admin', label: 'Admin', Icon: ShieldCheck }] : []),
    ];

    return (
        <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl sm:hidden">
            <div className="flex">
                {items.map(({ href, label, Icon }) => {
                    const active = path === href;

                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`relative flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors duration-300 ease-fluid ${
                                active ? 'text-primary' : 'text-muted-foreground'
                            }`}
                        >
                            <Icon weight={active ? 'fill' : 'light'} className="size-[22px]" />
                            {label}
                            {active && <span className="absolute -top-px h-0.5 w-8 rounded-full bg-primary" />}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
