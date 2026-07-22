import { ChatCircle, CheckCircle, XCircle } from '@phosphor-icons/react';
import { Link } from '@inertiajs/react';
import VerificationBadge from '@/components/verification-badge';
import { timeAgo } from '@/lib/time';
import type { PostSummary } from '@/types/chichipolies';

export default function PostCard({ post }: { post: PostSummary }) {
    return (
        <Link href={`/post/${post.id}`} className="group block px-5 py-5 transition-colors duration-300 ease-fluid hover:bg-secondary/50 sm:px-6">
            <div className="flex items-start gap-4">
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-medium tracking-[0.06em] text-muted-foreground uppercase">
                        <span className="text-primary">{post.category}</span>
                        <span aria-hidden>&middot;</span>
                        <span>{post.county}</span>
                        <VerificationBadge status={post.verification_status} />
                    </div>
                    <h2 className="font-display mt-1.5 text-lg leading-snug font-semibold text-foreground transition-colors duration-300 ease-fluid group-hover:text-primary">
                        {post.title}
                    </h2>
                    <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{post.body}</p>
                    <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground tabular-nums">
                        <span className="inline-flex items-center gap-1">
                            <CheckCircle weight="light" className="size-3.5" />
                            {post.true_votes}
                        </span>
                        <span className="inline-flex items-center gap-1">
                            <XCircle weight="light" className="size-3.5" />
                            {post.false_votes}
                        </span>
                        <span className="inline-flex items-center gap-1">
                            <ChatCircle weight="light" className="size-3.5" />
                            {post.comments_count}
                        </span>
                        <span className="ml-auto">
                            {post.user.name} &middot; {timeAgo(post.created_at)}
                        </span>
                    </div>
                </div>
                {post.photo_url && (
                    <div className="shrink-0 overflow-hidden rounded-xl ring-1 ring-border/60">
                        <img
                            src={post.photo_url}
                            alt=""
                            className="size-20 rounded-xl object-cover transition-transform duration-700 ease-fluid group-hover:scale-[1.03] sm:size-24"
                        />
                    </div>
                )}
            </div>
        </Link>
    );
}
