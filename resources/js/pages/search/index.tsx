import { Head } from '@inertiajs/react';
import { HeaderSearch } from '@/components/header-search';
import PostResultsList from '@/components/post-results-list';
import Reveal from '@/components/reveal';
import PublicLayout from '@/layouts/public-layout';
import type { Paginated, PostSummary } from '@/types/chichipolies';

interface Props {
    posts: Paginated<PostSummary>;
    filters: { search?: string };
}

export default function SearchIndex({ posts, filters }: Props) {
    const query = filters.search?.trim() ?? '';
    const hasQuery = query.length > 0;

    return (
        <PublicLayout>
            <Head title={hasQuery ? `Search: ${query}` : 'Search'} />

            <Reveal>
                <span className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-[10px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                    Search
                </span>
                <h1 className="font-display mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                    {hasQuery ? `Results for “${query}”` : 'Search stories'}
                </h1>
                <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-muted-foreground">
                    {hasQuery
                        ? `Showing stories matching your search across titles and body text.`
                        : 'Use the search bar in the header or the field below to find stories by keyword, place or topic.'}
                </p>
            </Reveal>

            <Reveal delay={100} className="mt-6 lg:hidden">
                <HeaderSearch compact />
            </Reveal>

            <Reveal delay={hasQuery ? 120 : 160} className="mt-8">
                <PostResultsList
                    posts={posts}
                    emptyTitle={hasQuery ? 'No stories found' : 'Start with a search term'}
                    emptyMessage={
                        hasQuery
                            ? 'Nothing matched that query. Try different keywords or browse by category in the footer.'
                            : 'Enter a word or phrase to search story titles and descriptions across Liberia.'
                    }
                    emptyAction={hasQuery ? { href: '/', label: 'Browse the feed' } : undefined}
                />
            </Reveal>
        </PublicLayout>
    );
}
