import { CaretLeft, CaretRight, ChatCircle, MagnifyingGlass, Newspaper, NotePencil, ShieldCheck } from '@phosphor-icons/react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import FeedComposer from '@/components/feed-composer';
import FeedSidebar from '@/components/feed-sidebar';
import PostCard from '@/components/post-card';
import PublicLayout from '@/layouts/public-layout';
import type { Paginated, PostSummary, UserRef } from '@/types/chichipolies';

interface Contributor extends UserRef {
    posts_count: number;
}

interface Props {
    posts: Paginated<PostSummary>;
    filters: { search?: string; category?: string; county?: string; tab?: string };
    categories: string[];
    counties: string[];
    topDiscussions: Pick<PostSummary, 'id' | 'title'>[];
    topContributors: Contributor[];
}

const field =
    'rounded-xl border border-input bg-card px-4 py-2.5 text-sm text-foreground transition-all duration-300 ease-fluid focus:border-ring focus:ring-2 focus:ring-ring/25 focus:outline-none';

const tabs = [
    { id: 'stories', label: 'Stories', Icon: NotePencil },
    { id: 'active', label: 'Active', Icon: ChatCircle },
    { id: 'verified', label: 'Verified', Icon: ShieldCheck },
] as const;

type TabId = (typeof tabs)[number]['id'];

export default function FeedIndex({ posts, filters, categories, counties, topDiscussions, topContributors }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const { auth } = usePage<{ auth: { user: unknown | null } }>().props;
    const activeTab = (filters.tab ?? 'stories') as TabId;

    const applyFilters = (overrides: Record<string, string | undefined>) => {
        const params = {
            search,
            category: filters.category,
            county: filters.county,
            tab: filters.tab ?? 'stories',
            ...overrides,
        };
        router.get('/', Object.fromEntries(Object.entries(params).filter(([, v]) => v)), {
            preserveState: true,
            replace: true,
        });
    };

    const pageLabel = (label: string) => label.replace('&laquo;', '').replace('&raquo;', '').trim();

    const hasFilters = Boolean(filters.search || filters.category || filters.county || (filters.tab && filters.tab !== 'stories'));

    return (
        <PublicLayout>
            <Head title="Community" />

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
                <div className="min-w-0 space-y-5">
                    <FeedComposer
                        categories={categories}
                        isAuthenticated={Boolean(auth.user)}
                        activeCategory={filters.category}
                        onCategoryClick={(category) => applyFilters({ category: category || undefined })}
                    />

                    <div className="overflow-hidden rounded-2xl bg-card shadow-soft ring-1 ring-border/60">
                        <div className="flex items-center gap-1 border-b border-border/60 px-2">
                            {tabs.map(({ id, label, Icon }) => {
                                const active = activeTab === id;

                                return (
                                    <button
                                        key={id}
                                        type="button"
                                        onClick={() => applyFilters({ tab: id === 'stories' ? undefined : id })}
                                        className={`relative flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium transition-colors ${
                                            active ? 'text-community' : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                    >
                                        <Icon weight={active ? 'fill' : 'light'} className="size-4" />
                                        {label}
                                        {active && <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-community" />}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="border-b border-border/60 px-5 py-4">
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
                                        className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
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
                        </div>

                        {posts.data.length > 0 ? (
                            <div className="divide-y divide-border/70">
                                {posts.data.map((post) => (
                                    <PostCard key={post.id} post={post} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center px-6 py-16 text-center">
                                <span className="flex size-12 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                                    <Newspaper weight="light" className="size-6" />
                                </span>
                                <h2 className="mt-4 text-lg font-semibold text-foreground">No stories here yet</h2>
                                <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                                    {hasFilters
                                        ? 'Nothing matches these filters. Try widening your search.'
                                        : 'Be the first to report what is happening in your county.'}
                                </p>
                                <Link
                                    href={auth.user ? '/submit' : '/login'}
                                    className="mt-6 rounded-lg bg-community px-5 py-2 text-sm font-semibold text-community-foreground transition-opacity hover:opacity-90"
                                >
                                    Post a story
                                </Link>
                            </div>
                        )}
                    </div>

                    {posts.links.length > 3 && (
                        <nav className="flex flex-wrap items-center justify-center gap-1" aria-label="Pagination">
                            {posts.links.map((link, i) => {
                                if (!link.url) return null;
                                const isPrev = link.label.includes('laquo');
                                const isNext = link.label.includes('raquo');

                                return (
                                    <Link
                                        key={i}
                                        href={link.url}
                                        className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-sm transition-all tabular-nums ${
                                            link.active
                                                ? 'bg-community font-semibold text-community-foreground'
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
                </div>

                <div className="hidden lg:block">
                    <FeedSidebar
                        topDiscussions={topDiscussions}
                        categories={categories}
                        topContributors={topContributors}
                        activeCategory={filters.category}
                        onCategoryClick={(category) => applyFilters({ category: category || undefined })}
                    />
                </div>
            </div>
        </PublicLayout>
    );
}
