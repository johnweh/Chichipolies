import { Image, Paperclip, Smiley, UsersThree } from '@phosphor-icons/react';
import { Link } from '@inertiajs/react';

interface FeedComposerProps {
    categories: string[];
    isAuthenticated: boolean;
    onCategoryClick: (category: string) => void;
    activeCategory?: string;
}

export default function FeedComposer({ categories = [], isAuthenticated, onCategoryClick, activeCategory }: FeedComposerProps) {
    const suggestedTags = categories.slice(0, 3);

    return (
        <div className="overflow-hidden rounded-2xl bg-card shadow-soft ring-1 ring-border/60">
            <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
                <div className="flex items-center gap-2.5">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-community/10 text-community">
                        <UsersThree weight="fill" className="size-4" />
                    </span>
                    <h2 className="text-base font-semibold text-foreground">Community</h2>
                </div>
            </div>

            <div className="px-5 py-4">
                {isAuthenticated ? (
                    <>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                            Share what&rsquo;s happening in your county. Report local news, ask questions, or help verify
                            stories from fellow citizens.
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {suggestedTags.map((tag) => (
                                <button
                                    key={tag}
                                    type="button"
                                    onClick={() => onCategoryClick(tag)}
                                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                                        activeCategory === tag
                                            ? 'bg-community text-community-foreground'
                                            : 'bg-secondary text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    {tag.toLowerCase().replace(/\s+/g, '-')}
                                </button>
                            ))}
                            <Link
                                href="/submit"
                                className="rounded-full border border-dashed border-border px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-community hover:text-community"
                            >
                                + Add story
                            </Link>
                        </div>
                    </>
                ) : (
                    <p className="text-sm leading-relaxed text-muted-foreground">
                        Sign in to report stories from your community and help verify what&rsquo;s true.
                    </p>
                )}
            </div>

            <div className="flex items-center justify-between border-t border-border/60 px-5 py-3">
                <div className="flex items-center gap-1 text-muted-foreground">
                    <button type="button" aria-label="Add emoji" className="rounded-lg p-2 transition-colors hover:bg-secondary hover:text-foreground">
                        <Smiley weight="light" className="size-5" />
                    </button>
                    <button type="button" aria-label="Add image" className="rounded-lg p-2 transition-colors hover:bg-secondary hover:text-foreground">
                        <Image weight="light" className="size-5" />
                    </button>
                    <button type="button" aria-label="Add attachment" className="rounded-lg p-2 transition-colors hover:bg-secondary hover:text-foreground">
                        <Paperclip weight="light" className="size-5" />
                    </button>
                </div>
                {isAuthenticated ? (
                    <Link
                        href="/submit"
                        className="rounded-lg bg-community px-5 py-2 text-sm font-semibold text-community-foreground transition-opacity hover:opacity-90 active:scale-[0.98]"
                    >
                        Post
                    </Link>
                ) : (
                    <Link
                        href="/login"
                        className="rounded-lg bg-community px-5 py-2 text-sm font-semibold text-community-foreground transition-opacity hover:opacity-90 active:scale-[0.98]"
                    >
                        Sign in to post
                    </Link>
                )}
            </div>
        </div>
    );
}
