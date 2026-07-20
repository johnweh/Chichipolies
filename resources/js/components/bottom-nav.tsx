import { Link, usePage } from '@inertiajs/react';

export default function BottomNav() {
    const { props, url } = usePage<{ auth: { user: { is_admin?: boolean } | null } }>();
    const { auth } = props;

    const items = [
        { href: '/', label: 'Feed', icon: '📰' },
        { href: '/submit', label: 'Post', icon: '✍️' },
        { href: '/about', label: 'About', icon: 'ℹ️' },
        ...(auth.user?.is_admin ? [{ href: '/admin', label: 'Admin', icon: '🛡️' }] : []),
    ];

    return (
        <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-gray-200 bg-white pb-[env(safe-area-inset-bottom)] sm:hidden dark:border-gray-700 dark:bg-gray-900">
            {items.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={`flex flex-1 flex-col items-center py-2 text-xs ${url === item.href ? 'font-semibold text-blue-900 dark:text-blue-300' : 'text-gray-500'}`}
                >
                    <span>{item.icon}</span>
                    {item.label}
                </Link>
            ))}
        </nav>
    );
}
