import { Heart } from '@phosphor-icons/react';
import { Head } from '@inertiajs/react';
import PostResultsList from '@/components/post-results-list';
import Reveal from '@/components/reveal';
import PublicLayout from '@/layouts/public-layout';
import type { Paginated, PostSummary } from '@/types/chichipolies';

interface Props {
    posts: Paginated<PostSummary>;
}

export default function SavedIndex({ posts }: Props) {
    return (
        <PublicLayout>
            <Head title="Saved stories" />

            <Reveal>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-[10px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                    <Heart weight="fill" className="size-3 text-primary" />
                    Saved
                </span>
                <h1 className="font-display mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                    Stories you marked true
                </h1>
                <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-muted-foreground">
                    These are stories you voted as likely true. They stay here so you can return to updates, comments and
                    verification changes.
                </p>
            </Reveal>

            <Reveal delay={120} className="mt-8">
                <PostResultsList
                    posts={posts}
                    emptyTitle="No saved stories yet"
                    emptyMessage="When you vote True on a story, it will appear here for quick access."
                    emptyAction={{ href: '/', label: 'Browse the feed' }}
                />
            </Reveal>
        </PublicLayout>
    );
}
