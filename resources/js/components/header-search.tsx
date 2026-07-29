import { MagnifyingGlass } from '@phosphor-icons/react';
import { router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface HeaderSearchProps {
    compact?: boolean;
}

export function HeaderSearch({ compact = false }: HeaderSearchProps) {
    const { url } = usePage();
    const query = url.split('?')[1] ?? '';
    const params = new URLSearchParams(query);
    const currentSearch = params.get('search') ?? '';
    const [search, setSearch] = useState(currentSearch);

    useEffect(() => {
        setSearch(currentSearch);
    }, [currentSearch]);

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        const trimmed = search.trim();
        router.get('/search', trimmed ? { search: trimmed } : {}, { preserveState: false, replace: false });
    };

    if (compact) {
        return (
            <form onSubmit={submit} className="relative w-full">
                <MagnifyingGlass
                    weight="light"
                    className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                />
                <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search stories"
                    aria-label="Search stories"
                    className="w-full rounded-xl border border-input bg-card py-2.5 pr-4 pl-9 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/25 focus:outline-none"
                />
            </form>
        );
    }

    return (
        <form onSubmit={submit} className="relative hidden min-w-[220px] flex-1 lg:block lg:max-w-sm xl:max-w-md">
            <MagnifyingGlass
                weight="light"
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-nav-foreground/50"
            />
            <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search stories"
                aria-label="Search stories"
                className="w-full rounded-full border border-nav-foreground/15 bg-nav-foreground/10 py-2 pr-4 pl-9 text-sm text-nav-foreground placeholder:text-nav-foreground/50 focus:border-nav-foreground/30 focus:bg-nav-foreground/15 focus:outline-none focus:ring-2 focus:ring-nav-foreground/20"
            />
        </form>
    );
}

export function MobileHeaderSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [search, setSearch] = useState('');

    if (!open) return null;

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        const trimmed = search.trim();
        router.get('/search', trimmed ? { search: trimmed } : {}, {
            preserveState: false,
            onFinish: onClose,
        });
    };

    return (
        <div className="border-t border-nav-foreground/10 bg-nav px-4 py-3 lg:hidden">
            <form onSubmit={submit} className="relative">
                <MagnifyingGlass
                    weight="light"
                    className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-nav-foreground/50"
                />
                <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search stories"
                    aria-label="Search stories"
                    autoFocus
                    className="w-full rounded-full border border-nav-foreground/15 bg-nav-foreground/10 py-2.5 pr-4 pl-9 text-sm text-nav-foreground placeholder:text-nav-foreground/50 focus:border-nav-foreground/30 focus:bg-nav-foreground/15 focus:outline-none focus:ring-2 focus:ring-nav-foreground/20"
                />
            </form>
        </div>
    );
}
