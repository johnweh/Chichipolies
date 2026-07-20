import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import ReportDialog from '@/components/report-dialog';
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
    const { auth } = usePage().props as { auth: { user: { id: number } | null } };
    const commentForm = useForm({ body: '' });
    const [suggesting, setSuggesting] = useState(false);

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
        if (navigator.share) {
            await navigator.share({ title: post.title, url });
        } else {
            await navigator.clipboard.writeText(url);
            alert('Link copied!');
        }
    };

    const submitComment = (e: React.FormEvent) => {
        e.preventDefault();
        commentForm.post(`/post/${post.id}/comments`, {
            preserveScroll: true,
            onSuccess: () => commentForm.reset(),
        });
    };

    return (
        <PublicLayout>
            <Head title={post.title} />
            <article>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="rounded bg-blue-900/10 px-1.5 py-0.5 font-medium text-blue-900 dark:bg-blue-400/10 dark:text-blue-300">
                        {post.category}
                    </span>
                    <span>{post.county}</span>
                    <VerificationBadge status={post.verification_status} />
                </div>
                <h1 className="mt-2 text-2xl font-bold">{post.title}</h1>
                <p className="mt-1 text-xs text-gray-500">
                    by {post.user.name} · {new Date(post.created_at).toLocaleDateString('en-GB')}
                </p>
                {post.photo_url && <img src={post.photo_url} alt="" className="mt-4 w-full rounded-xl" />}
                {post.video_url && (
                    <div className="mt-4">
                        <VideoEmbed url={post.video_url} />
                    </div>
                )}
                <p className="mt-4 whitespace-pre-wrap text-gray-800 dark:text-gray-200">{post.body}</p>

                <div className="mt-6 flex items-center gap-3 border-y border-gray-200 py-3 dark:border-gray-700">
                    <span className="text-sm font-medium">Is this true?</span>
                    <button
                        onClick={() => vote(true)}
                        className={`rounded-lg border px-3 py-1.5 text-sm ${userVote === true ? 'border-green-600 bg-green-600 text-white' : 'border-gray-300 dark:border-gray-700'}`}
                    >
                        True ({post.true_votes})
                    </button>
                    <button
                        onClick={() => vote(false)}
                        className={`rounded-lg border px-3 py-1.5 text-sm ${userVote === false ? 'border-red-600 bg-red-600 text-white' : 'border-gray-300 dark:border-gray-700'}`}
                    >
                        False ({post.false_votes})
                    </button>
                    <button onClick={share} className="ml-auto text-sm text-gray-500 hover:text-blue-900">
                        ↗ Share
                    </button>
                    {auth.user && <ReportDialog postId={post.id} reasons={reportReasons} />}
                </div>

                <section className="mt-6">
                    <h2 className="font-semibold">Comments ({post.comments.length})</h2>
                    {auth.user ? (
                        <form onSubmit={submitComment} className="mt-3 flex gap-2">
                            <input
                                value={commentForm.data.body}
                                onChange={(e) => commentForm.setData('body', e.target.value)}
                                placeholder="Write a comment..."
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                            />
                            <button
                                type="button"
                                onClick={suggest}
                                disabled={suggesting}
                                className="rounded-lg border border-gray-300 px-3 text-sm dark:border-gray-700"
                            >
                                ✨
                            </button>
                            <button
                                type="submit"
                                disabled={commentForm.processing}
                                className="rounded-lg bg-blue-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                            >
                                Post
                            </button>
                        </form>
                    ) : (
                        <p className="mt-3 text-sm text-gray-500">Sign in to comment.</p>
                    )}
                    <ul className="mt-4 flex flex-col gap-3">
                        {post.comments.map((comment) => (
                            <li key={comment.id} className="rounded-lg bg-gray-50 p-3 text-sm dark:bg-gray-800">
                                <span className="font-medium">{comment.user.name}</span>
                                <p className="mt-1 text-gray-700 dark:text-gray-300">{comment.body}</p>
                            </li>
                        ))}
                    </ul>
                </section>
            </article>
        </PublicLayout>
    );
}
