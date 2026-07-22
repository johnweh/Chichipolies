import { ChatCircle, CheckCircle, XCircle } from '@phosphor-icons/react';
import { Link } from '@inertiajs/react';
import VerificationBadge from '@/components/verification-badge';
import type { PostSummary } from '@/types/chichipolies';

export default function FeaturedPost({ post }: { post: PostSummary }) {
    return (
        <Link href={`/post/${post.id}`} className="group block">
            <article className="rounded-3xl bg-card shadow-soft ring-1 ring-border/60">
                <div className="overflow-hidden rounded-3xl">
                    {post.photo_url && (
                        <div className="overflow-hidden">
                            <img
                                src={post.photo_url}
                                alt=""
                                className="max-h-72 w-full object-cover transition-transform duration-1000 ease-fluid group-hover:scale-[1.02]"
                            />
                        </div>
                    )}
                    <div className="px-5 py-5 sm:px-7 sm:py-6">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-medium tracking-[0.06em] text-muted-foreground uppercase">
                            <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold tracking-[0.12em] text-primary-foreground">
                                Latest
                            </span>
                            <span className="text-primary">{post.category}</span>
                            <span aria-hidden>&middot;</span>
                            <span>{post.county}</span>
                            <VerificationBadge status={post.verification_status} />
                        </div>
                        <h2 className="font-display mt-2.5 text-2xl leading-snug font-semibold tracking-tight text-foreground transition-colors duration-300 ease-fluid group-hover:text-primary sm:text-3xl">
                            {post.title}
                        </h2>
                        <p className="mt-2 line-clamp-2 max-w-[65ch] text-sm leading-relaxed text-muted-foreground sm:line-clamp-3">
                            {post.body}
                        </p>
                        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground tabular-nums">
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
                            <span className="ml-auto">by {post.user.name}</span>
                        </div>
                    </div>
                </div>
            </article>
        </Link>
    );
}
