import { ChatCircle, Eye, Seal } from '@phosphor-icons/react';
import { Link } from '@inertiajs/react';
import UserAvatar from '@/components/user-avatar';
import { timeAgo } from '@/lib/time';
import type { PostSummary } from '@/types/chichipolies';

const platformName = 'Chichipolies';

export default function PostCard({ post }: { post: PostSummary }) {
    const views = post.true_votes + post.false_votes;
    const authorName = post.is_official ? platformName : post.user.name;

    return (
        <Link href={`/post/${post.id}`} className="group block px-5 py-5 transition-colors hover:bg-secondary/40 sm:px-6">
            <div className="flex items-start gap-3">
                <UserAvatar name={authorName} size="sm" />
                <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground">
                        By: <span className="font-medium text-foreground">{authorName}</span>
                        <span aria-hidden> &middot; </span>
                        {timeAgo(post.created_at)}
                    </p>
                    <h2 className="mt-1.5 text-base leading-snug font-semibold text-foreground transition-colors group-hover:text-primary">
                        {post.title}
                    </h2>
                    <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{post.body}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                        {post.is_official && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-nav/10 px-2.5 py-0.5 text-[11px] font-semibold text-nav">
                                <Seal weight="fill" className="size-3" />
                                Official
                            </span>
                        )}
                        <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                            {post.category}
                        </span>
                        <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                            {post.county}
                        </span>
                        <span className="ml-auto flex items-center gap-3 text-xs text-muted-foreground tabular-nums">
                            <span className="inline-flex items-center gap-1">
                                <ChatCircle weight="light" className="size-3.5" />
                                {post.comments_count} {post.comments_count === 1 ? 'reply' : 'replies'}
                            </span>
                            <span className="inline-flex items-center gap-1">
                                <Eye weight="light" className="size-3.5" />
                                {views} {views === 1 ? 'vote' : 'votes'}
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
