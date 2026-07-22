import { ArrowLeft, ArrowUpRight, CheckCircle, PaperPlaneRight, Sparkle, XCircle } from '@phosphor-icons/react';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import ReportDialog from '@/components/report-dialog';
import { timeAgo } from '@/lib/time';
import Reveal from '@/components/reveal';
import VerificationBadge from '@/components/verification-badge';
import VideoEmbed from '@/components/video-embed';
import PublicLayout from '@/layouts/public-layout';
import type { CommentItem, PostSummary } from '@/types/chichipolies';

interface Props {
    post: PostSummary & { comments: CommentItem[] };
    userVote: boolean | null;
    reportReasons: string[];
}

export default function PostShow({ post, userVote, reportReasons }: Props) {
    const { auth } = usePage().props as unknown as { auth: { user: { id: number } | null } };
    const commentForm = useForm({ body: '' });
    const [suggesting, setSuggesting] = useState(false);
    const [copied, setCopied] = useState(false);

    const suggest = async () => {
        setSuggesting(true);
        try {
            const res = await fetch('/ai/suggest-comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] ?? ''),
                },
                body: JSON.stringify({ post_id: post.id }),
            });
            if (!res.ok) throw new Error();
            commentForm.setData('body', (await res.json()).comment);
        } catch {
            alert('AI helper is unavailable right now.');
        } finally {
            setSuggesting(false);
        }
    };

    const vote = (isTrue: boolean) => {
        if (!auth.user) return router.visit('/login');
        router.post(`/post/${post.id}/vote`, { is_true: isTrue }, { preserveScroll: true });
    };

    const share = async () => {
        const url = window.location.href;
        try {
            if (navigator.share) {
                await navigator.share({ title: post.title, url });
            } else {
                await navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }
        } catch {
            /* user cancelled the share sheet */
        }
    };

    const submitComment = (e: React.FormEvent) => {
        e.preventDefault();
        commentForm.post(`/post/${post.id}/comments`, {
            preserveScroll: true,
            onSuccess: () => commentForm.reset(),
        });
    };

    const voteButton = (isTrue: boolean, label: string, count: number) => {
        const active = userVote === isTrue;
        const activeClasses = isTrue
            ? 'border-emerald-600/40 bg-emerald-600 text-white'
            : 'border-red-600/40 bg-red-600 text-white';

        return (
            <button
                onClick={() => vote(isTrue)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 ease-fluid active:scale-[0.97] tabular-nums ${
                    active ? activeClasses : 'border-input bg-card text-foreground hover:bg-secondary'
                }`}
            >
                {isTrue ? <CheckCircle weight={active ? 'fill' : 'light'} className="size-4" /> : <XCircle weight={active ? 'fill' : 'light'} className="size-4" />}
                {label} &middot; {count}
            </button>
        );
    };

    return (
        <PublicLayout>
            <Head title={post.title} />
            <article>
                <Reveal>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors duration-300 hover:text-foreground"
                    >
                        <ArrowLeft weight="bold" className="size-3.5" />
                        All stories
                    </Link>

                    <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-medium tracking-[0.06em] text-muted-foreground uppercase">
                        <span className="text-primary">{post.category}</span>
                        <span aria-hidden>&middot;</span>
                        <span>{post.county}</span>
                        <VerificationBadge status={post.verification_status} />
                    </div>

                    <h1 className="font-display mt-3 text-3xl leading-tight font-semibold tracking-tight text-foreground sm:text-4xl">
                        {post.title}
                    </h1>

                    <div className="mt-4 flex items-center gap-2.5">
                        <span className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-xs font-bold text-primary uppercase">
                            {post.user.name.charAt(0)}
                        </span>
                        <div className="text-xs">
                            <p className="font-semibold text-foreground">{post.user.name}</p>
                            <p className="text-muted-foreground">
                                {new Date(post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                        </div>
                    </div>
                </Reveal>

                <Reveal delay={100}>
                    {post.photo_url && (
                        <div className="mt-6 rounded-3xl bg-card shadow-soft ring-1 ring-border/60">
                            <img src={post.photo_url} alt={post.title} className="w-full rounded-3xl object-cover" />
                        </div>
                    )}
                    {post.video_url && (
                        <div className="mt-6">
                            <VideoEmbed url={post.video_url} />
                        </div>
                    )}

                    <div className="mt-6 max-w-[65ch] text-[15px] leading-[1.75] whitespace-pre-wrap text-foreground/90">{post.body}</div>
                </Reveal>

                <Reveal delay={150}>
                    <div className="mt-10 rounded-3xl bg-card shadow-soft ring-1 ring-border/60">
                        <div className="rounded-3xl bg-card px-5 py-5 sm:px-6">
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-[10px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">Community verification</p>
                                <VerificationBadge status={post.verification_status} />
                            </div>
                            {post.true_votes + post.false_votes > 0 && (
                                <div className="mt-3">
                                    <div className="flex h-1.5 overflow-hidden rounded-full bg-secondary">
                                        <span
                                            className="rounded-l-full bg-emerald-600/80 transition-all duration-700 ease-fluid dark:bg-emerald-400/80"
                                            style={{ width: `${(post.true_votes / (post.true_votes + post.false_votes)) * 100}%` }}
                                        />
                                        <span
                                            className="rounded-r-full bg-red-600/70 transition-all duration-700 ease-fluid dark:bg-red-400/70"
                                            style={{ width: `${(post.false_votes / (post.true_votes + post.false_votes)) * 100}%` }}
                                        />
                                    </div>
                                    <p className="mt-1.5 text-xs text-muted-foreground tabular-nums">
                                        {Math.round((post.true_votes / (post.true_votes + post.false_votes)) * 100)}% of{' '}
                                        {post.true_votes + post.false_votes} voters say this is true
                                    </p>
                                </div>
                            )}
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                {voteButton(true, 'True', post.true_votes)}
                                {voteButton(false, 'False', post.false_votes)}
                                <div className="ml-auto flex items-center gap-1">
                                    <button
                                        onClick={share}
                                        className="group inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium text-muted-foreground transition-all duration-300 ease-fluid hover:bg-secondary hover:text-foreground active:scale-[0.97]"
                                    >
                                        {copied ? 'Link copied' : 'Share'}
                                        <ArrowUpRight
                                            weight="bold"
                                            className="size-3.5 transition-transform duration-300 ease-fluid group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                        />
                                    </button>
                                    {auth.user && <ReportDialog postId={post.id} reasons={reportReasons} />}
                                </div>
                            </div>
                            {!auth.user && (
                                <p className="mt-3 text-xs text-muted-foreground">
                                    <Link href="/login" className="font-medium text-primary hover:underline">
                                        Sign in
                                    </Link>{' '}
                                    to vote on whether this story is true.
                                </p>
                            )}
                        </div>
                    </div>
                </Reveal>

                <Reveal delay={200}>
                    <section className="mt-12">
                        <h2 className="font-display text-xl font-semibold text-foreground">
                            Comments <span className="text-muted-foreground tabular-nums">({post.comments.length})</span>
                        </h2>

                        {auth.user ? (
                            <form onSubmit={submitComment} className="mt-4 flex gap-2">
                                <input
                                    value={commentForm.data.body}
                                    onChange={(e) => commentForm.setData('body', e.target.value)}
                                    placeholder="Write a comment"
                                    className="w-full rounded-full border border-input bg-card px-4 py-2.5 text-sm transition-all duration-300 ease-fluid focus:border-ring focus:ring-2 focus:ring-ring/25 focus:outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={suggest}
                                    disabled={suggesting}
                                    aria-label="Suggest a comment"
                                    title="Suggest a comment"
                                    className="flex size-10 shrink-0 items-center justify-center rounded-full border border-input bg-card text-muted-foreground transition-all duration-300 ease-fluid hover:bg-secondary hover:text-foreground active:scale-95 disabled:opacity-50"
                                >
                                    <Sparkle weight={suggesting ? 'fill' : 'light'} className={`size-4 ${suggesting ? 'animate-pulse' : ''}`} />
                                </button>
                                <button
                                    type="submit"
                                    disabled={commentForm.processing || !commentForm.data.body.trim()}
                                    aria-label="Post comment"
                                    className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all duration-300 ease-fluid hover:opacity-90 active:scale-95 disabled:opacity-50"
                                >
                                    <PaperPlaneRight weight="fill" className="size-4" />
                                </button>
                            </form>
                        ) : (
                            <p className="mt-4 text-sm text-muted-foreground">
                                <Link href="/login" className="font-medium text-primary hover:underline">
                                    Sign in
                                </Link>{' '}
                                to join the conversation.
                            </p>
                        )}

                        {commentForm.errors.body && <p className="mt-2 text-xs text-red-600">{commentForm.errors.body}</p>}

                        <ul className="mt-6 divide-y divide-border/70">
                            {post.comments.map((comment) => (
                                <li key={comment.id} className="flex gap-3 py-4">
                                    <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-secondary text-[10px] font-bold text-muted-foreground uppercase">
                                        {comment.user.name.charAt(0)}
                                    </span>
                                    <div className="min-w-0">
                                        <p className="text-xs text-foreground">
                                            <span className="font-semibold">{comment.user.name}</span>
                                            <span className="ml-2 text-muted-foreground">{timeAgo(comment.created_at)}</span>
                                        </p>
                                        <p className="mt-0.5 text-sm leading-relaxed text-foreground/85">{comment.body}</p>
                                    </div>
                                </li>
                            ))}
                            {post.comments.length === 0 && (
                                <li className="py-6 text-sm text-muted-foreground">No comments yet. Share what you know.</li>
                            )}
                        </ul>
                    </section>
                </Reveal>
            </article>
        </PublicLayout>
    );
}
