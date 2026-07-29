import { ArrowRight, Fire } from '@phosphor-icons/react';
import { Link } from '@inertiajs/react';
import UserAvatar from '@/components/user-avatar';
import type { PostSummary, UserRef } from '@/types/chichipolies';

interface Contributor extends UserRef {
    posts_count: number;
}

interface FeedSidebarProps {
    topDiscussions: Pick<PostSummary, 'id' | 'title'>[];
    categories: string[];
    topContributors: Contributor[];
    activeCategory?: string;
    onCategoryClick: (category: string) => void;
}

export default function FeedSidebar({
    topDiscussions = [],
    categories = [],
    topContributors = [],
    activeCategory,
    onCategoryClick,
}: FeedSidebarProps) {
    return (
        <aside className="flex flex-col gap-5">
            <div className="rounded-2xl bg-card p-5 shadow-soft ring-1 ring-border/60">
                <h3 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                    Top discussion this week
                    <Fire weight="fill" className="size-4 text-primary" />
                </h3>
                <ul className="mt-4 space-y-4">
                    {topDiscussions.length > 0 ? (
                        topDiscussions.map((post) => (
                            <li key={post.id}>
                                <Link href={`/post/${post.id}`} className="group block">
                                    <p className="text-sm leading-snug text-foreground transition-colors group-hover:text-primary">
                                        {post.title}
                                    </p>
                                    <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors group-hover:text-primary">
                                        Details
                                        <ArrowRight weight="bold" className="size-3" />
                                    </span>
                                </Link>
                            </li>
                        ))
                    ) : (
                        <li className="text-sm text-muted-foreground">No active discussions yet this week.</li>
                    )}
                </ul>
            </div>

            <div className="rounded-2xl bg-card p-5 shadow-soft ring-1 ring-border/60">
                <h3 className="text-sm font-semibold text-foreground">Recommended topics</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                    {categories.slice(0, 5).map((category) => (
                        <button
                            key={category}
                            type="button"
                            onClick={() => onCategoryClick(category)}
                            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                                activeCategory === category
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-secondary text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
                <button
                    type="button"
                    onClick={() => onCategoryClick('')}
                    className="mt-4 text-xs font-semibold text-primary transition-opacity hover:opacity-80"
                >
                    See more topics
                </button>
            </div>

            <div className="rounded-2xl bg-card p-5 shadow-soft ring-1 ring-border/60">
                <h3 className="text-sm font-semibold text-foreground">Active reporters</h3>
                <ul className="mt-4 space-y-4">
                    {topContributors.length > 0 ? (
                        topContributors.map((user) => (
                            <li key={user.id} className="flex items-center gap-3">
                                <UserAvatar name={user.name} size="md" />
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-foreground">{user.name}</p>
                                    <p className="truncate text-xs text-muted-foreground">
                                        {user.posts_count} {user.posts_count === 1 ? 'story' : 'stories'} reported
                                    </p>
                                </div>
                            </li>
                        ))
                    ) : (
                        <li className="text-sm text-muted-foreground">No reporters yet.</li>
                    )}
                </ul>
            </div>
        </aside>
    );
}
