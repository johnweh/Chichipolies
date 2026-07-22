import { CaretLeft, CaretRight, MagnifyingGlass, Newspaper } from '@phosphor-icons/react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import PostCard from '@/components/post-card';
import Reveal from '@/components/reveal';
import PublicLayout from '@/layouts/public-layout';
import type { Paginated, PostSummary } from '@/types/chichipolies';

interface Props {
    posts: Paginated<PostSummary>;
    filters: { search?: string; category?: string; county?: string };
    categories: string[];
    counties: string[];
}

const field =
    'rounded-full border border-input bg-card px-4 py-2 text-sm text-foreground transition-all duration-300 ease-fluid focus:border-ring focus:ring-2 focus:ring-ring/25 focus:outline-none';

export default function FeedIndex({ posts, filters, categories, counties }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const { auth } = usePage<{ auth: { user: unknown | null } }>().props;

    const applyFilters = (overrides: Record<string, string | undefined>) => {
        const params = { search, category: filters.category, county: filters.county, ...overrides };
        router.get('/', Object.fromEntries(Object.entries(params).filter(([, v]) => v)), {
            preserveState: true,
            replace: true,
        });
    };

    const pageLabel = (label: string) => label.replace('&laquo;', '').replace('&raquo;', '').trim();

    return (
        <PublicLayout>
            <Head title="Community News" />

            <Reveal>
                <span className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-[10px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                    Citizen reporting &middot; 15 counties
                </span>
                <h1 className="font-display mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                    What&rsquo;s happening across Liberia
                </h1>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                    Stories reported by citizens, verified by the community. Read, vote on what&rsquo;s true, and add what you know.
                </p>
            </Reveal>

            <Reveal delay={100} className="mt-8">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        applyFilters({ search });
                    }}
                    className="flex flex-col gap-2 sm:flex-row"
                >
                    <div className="relative flex-1">
                        <MagnifyingGlass
                            weight="light"
                            className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
                        />
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search stories"
                            className={`${field} w-full pl-10`}
                        />
                    </div>
                    <select
                        value={filters.category ?? ''}
                        onChange={(e) => applyFilters({ category: e.target.value || undefined })}
                        className={field}
                    >
                        <option value="">All categories</option>
                        {categories.map((c) => (
                            <option key={c}>{c}</option>
                        ))}
                    </select>
                    <select
                        value={filters.county ?? ''}
                        onChange={(e) => applyFilters({ county: e.target.value || undefined })}
                        className={field}
                    >
                        <option value="">All counties</option>
                        {counties.map((c) => (
                            <option key={c}>{c}</option>
                        ))}
                    </select>
                </form>
            </Reveal>

            <Reveal delay={180} className="mt-6">
                {posts.data.length > 0 ? (
                    <div className="rounded-[1.75rem] bg-foreground/[0.03] p-1.5 ring-1 ring-border/70">
                        <div className="divide-y divide-border/70 overflow-hidden rounded-[calc(1.75rem-0.375rem)] bg-card shadow-[inset_0_1px_1px_hsl(40,30%,100%,0.4)] dark:shadow-none">
                            {posts.data.map((post) => (
                                <PostCard key={post.id} post={post} />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="rounded-[1.75rem] bg-foreground/[0.03] p-1.5 ring-1 ring-border/70">
                        <div className="flex flex-col items-center rounded-[calc(1.75rem-0.375rem)] bg-card px-6 py-20 text-center">
                            <span className="flex size-12 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                                <Newspaper weight="light" className="size-6" />
                            </span>
                            <h2 className="font-display mt-4 text-lg font-semibold text-foreground">No stories here yet</h2>
                            <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                                {filters.search || filters.category || filters.county
                                    ? 'Nothing matches these filters. Try widening your search.'
                                    : 'Be the first to report what is happening in your county.'}
                            </p>
                            <Link
                                href={auth.user ? '/submit' : '/login'}
                                className="mt-6 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-all duration-300 ease-fluid hover:opacity-90 active:scale-[0.98]"
                            >
                                Post a story
                            </Link>
                        </div>
                    </div>
                )}
            </Reveal>

            {posts.links.length > 3 && (
                <nav className="mt-8 flex flex-wrap items-center justify-center gap-1" aria-label="Pagination">
                    {posts.links.map((link, i) => {
                        if (!link.url) return null;
                        const isPrev = link.label.includes('laquo');
                        const isNext = link.label.includes('raquo');

                        return (
                            <Link
                                key={i}
                                href={link.url}
                                className={`flex h-9 min-w-9 items-center justify-center rounded-full px-3 text-sm transition-all duration-300 ease-fluid tabular-nums ${
                                    link.active
                                        ? 'bg-primary font-semibold text-primary-foreground'
                                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                                }`}
                            >
                                {isPrev ? (
                                    <CaretLeft weight="bold" className="size-3.5" />
                                ) : isNext ? (
                                    <CaretRight weight="bold" className="size-3.5" />
                                ) : (
                                    pageLabel(link.label)
                                )}
                            </Link>
                        );
                    })}
                </nav>
            )}
        </PublicLayout>
    );
}
