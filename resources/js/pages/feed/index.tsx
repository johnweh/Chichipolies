import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import PostCard from '@/components/post-card';
import PublicLayout from '@/layouts/public-layout';
import type { Paginated, PostSummary } from '@/types/chichipolies';

interface Props {
    posts: Paginated<PostSummary>;
    filters: { search?: string; category?: string; county?: string };
    categories: string[];
    counties: string[];
}

export default function FeedIndex({ posts, filters, categories, counties }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');

    const applyFilters = (overrides: Record<string, string | undefined>) => {
        const params = { search, category: filters.category, county: filters.county, ...overrides };
        router.get('/', Object.fromEntries(Object.entries(params).filter(([, v]) => v)), {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <PublicLayout>
            <Head title="Community News" />
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    applyFilters({ search });
                }}
                className="flex flex-col gap-2 sm:flex-row"
            >
                <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search stories..."
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                />
                <select
                    value={filters.category ?? ''}
                    onChange={(e) => applyFilters({ category: e.target.value || undefined })}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                >
                    <option value="">Category</option>
                    {categories.map((c) => (
                        <option key={c}>{c}</option>
                    ))}
                </select>
                <select
                    value={filters.county ?? ''}
                    onChange={(e) => applyFilters({ county: e.target.value || undefined })}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                >
                    <option value="">County</option>
                    {counties.map((c) => (
                        <option key={c}>{c}</option>
                    ))}
                </select>
            </form>

            <div className="mt-4 flex flex-col gap-3">
                {posts.data.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}
                {posts.data.length === 0 && (
                    <p className="py-12 text-center text-sm text-gray-500">No stories yet. Be the first to post!</p>
                )}
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-1">
                {posts.links.map((link, i) =>
                    link.url ? (
                        <Link
                            key={i}
                            href={link.url}
                            className={`rounded px-3 py-1 text-sm ${link.active ? 'bg-blue-900 text-white' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ) : null,
                )}
            </div>
        </PublicLayout>
    );
}
