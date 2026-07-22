import { Link } from '@inertiajs/react';
import VerificationBadge from '@/components/verification-badge';
import type { PostSummary } from '@/types/chichipolies';

export default function PostCard({ post }: { post: PostSummary }) {
    return (
        <Link
            href={`/post/${post.id}`}
            className="block rounded-xl border border-gray-200 bg-white p-4 transition hover:border-blue-900/40 dark:border-gray-700 dark:bg-gray-900"
        >
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span className="rounded bg-blue-900/10 px-1.5 py-0.5 font-medium text-blue-900 dark:bg-blue-400/10 dark:text-blue-300">
                    {post.category}
                </span>
                <span>{post.county}</span>
                <VerificationBadge status={post.verification_status} />
            </div>
            <h2 className="mt-2 font-semibold text-gray-900 dark:text-gray-100">{post.title}</h2>
            <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">{post.body}</p>
            {post.photo_url && (
                <img src={post.photo_url} alt="" className="mt-3 max-h-48 w-full rounded-lg object-cover" />
            )}
            <div className="mt-3 flex gap-4 text-xs text-gray-500 dark:text-gray-400">
                <span>✓ {post.true_votes}</span>
                <span>✗ {post.false_votes}</span>
                <span>💬 {post.comments_count}</span>
                <span className="ml-auto">by {post.user.name}</span>
            </div>
        </Link>
    );
}
