import { CaretLeft, CaretRight, MagnifyingGlass } from '@phosphor-icons/react';
import { Link } from '@inertiajs/react';
import PostCard from '@/components/post-card';
import type { Paginated, PostSummary } from '@/types/chichipolies';

interface PostResultsListProps {
    posts: Paginated<PostSummary>;
    emptyTitle: string;
    emptyMessage: string;
    emptyAction?: { href: string; label: string };
}

const pageLabel = (label: string) => label.replace('&laquo;', '').replace('&raquo;', '').trim();

export default function PostResultsList({ posts, emptyTitle, emptyMessage, emptyAction }: PostResultsListProps) {
    return (
        <>
            {(posts?.data ?? []).length > 0 ? (
                <div className="overflow-hidden rounded-2xl bg-card shadow-soft ring-1 ring-border/60">
                    <div className="divide-y divide-border/70">
                        {(posts?.data ?? []).map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="overflow-hidden rounded-2xl bg-card shadow-soft ring-1 ring-border/60">
                    <div className="flex flex-col items-center px-6 py-16 text-center">
                        <span className="flex size-12 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                            <MagnifyingGlass weight="light" className="size-6" />
                        </span>
                        <h2 className="mt-4 text-lg font-semibold text-foreground">{emptyTitle}</h2>
                        <p className="mt-1 max-w-xs text-sm text-muted-foreground">{emptyMessage}</p>
                        {emptyAction && (
                            <Link
                                href={emptyAction.href}
                                className="mt-6 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                            >
                                {emptyAction.label}
                            </Link>
                        )}
                    </div>
                </div>
            )}

            {(posts?.links ?? []).length > 3 && (
                <nav className="mt-6 flex flex-wrap items-center justify-center gap-1" aria-label="Pagination">
                    {(posts?.links ?? []).map((link, i) => {
                        if (!link.url) return null;
                        const isPrev = link.label.includes('laquo');
                        const isNext = link.label.includes('raquo');

                        return (
                            <Link
                                key={i}
                                href={link.url}
                                className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-sm transition-all tabular-nums ${
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
        </>
    );
}
