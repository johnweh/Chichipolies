import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import PublicLayout from '@/layouts/public-layout';
import type { Paginated, PostSummary } from '@/types/chichipolies';

interface AdminUser {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
    banned_at: string | null;
    posts_count: number;
}

interface PendingReport {
    id: number;
    reason: string;
    created_at: string;
    post: { id: number; title: string };
    user: { id: number; name: string };
}

interface Props {
    posts: Paginated<PostSummary>;
    users: AdminUser[];
    reports: PendingReport[];
}

const tabs = ['Posts', 'Users', 'Reports'] as const;

export default function AdminIndex({ posts, users, reports }: Props) {
    const [tab, setTab] = useState<(typeof tabs)[number]>('Posts');
    const btn = 'rounded px-2 py-1 text-xs font-medium';

    return (
        <PublicLayout>
            <Head title="Admin" />
            <h1 className="text-xl font-bold">Admin</h1>
            <div className="mt-3 flex gap-1 border-b border-gray-200 dark:border-gray-700">
                {tabs.map((t) => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`px-3 py-2 text-sm ${tab === t ? 'border-b-2 border-blue-900 font-semibold text-blue-900 dark:text-blue-300' : 'text-gray-500'}`}
                    >
                        {t}
                        {t === 'Reports' && reports.length > 0 && (
                            <span className="ml-1 rounded-full bg-red-600 px-1.5 text-xs text-white">{reports.length}</span>
                        )}
                    </button>
                ))}
            </div>

            {tab === 'Posts' && (
                <ul className="mt-4 flex flex-col gap-2">
                    {posts.data.map((post) => (
                        <li key={post.id} className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 text-sm dark:border-gray-700">
                            <div className="min-w-0 flex-1">
                                <p className="truncate font-medium">{post.title}</p>
                                <p className="text-xs text-gray-500">
                                    {post.user.name} · {post.category} · {post.county} · {post.verification_status}
                                </p>
                            </div>
                            <button
                                onClick={() => confirm('Delete this post?') && router.delete(`/admin/posts/${post.id}`, { preserveScroll: true })}
                                className={`${btn} bg-red-600 text-white`}
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {tab === 'Users' && (
                <ul className="mt-4 flex flex-col gap-2">
                    {users.map((user) => (
                        <li key={user.id} className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 text-sm dark:border-gray-700">
                            <div className="min-w-0 flex-1">
                                <p className="font-medium">
                                    {user.name} {user.is_admin && <span className="text-xs text-blue-900 dark:text-blue-300">(admin)</span>}
                                    {user.banned_at && <span className="text-xs text-red-600"> (banned)</span>}
                                </p>
                                <p className="text-xs text-gray-500">{user.email} · {user.posts_count} posts</p>
                            </div>
                            {!user.is_admin &&
                                (user.banned_at ? (
                                    <button
                                        onClick={() => router.post(`/admin/users/${user.id}/unban`, {}, { preserveScroll: true })}
                                        className={`${btn} bg-gray-200 dark:bg-gray-700`}
                                    >
                                        Unban
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => router.post(`/admin/users/${user.id}/ban`, {}, { preserveScroll: true })}
                                        className={`${btn} bg-red-600 text-white`}
                                    >
                                        Ban
                                    </button>
                                ))}
                        </li>
                    ))}
                </ul>
            )}

            {tab === 'Reports' && (
                <ul className="mt-4 flex flex-col gap-2">
                    {reports.length === 0 && <p className="py-8 text-center text-sm text-gray-500">No pending reports.</p>}
                    {reports.map((report) => (
                        <li key={report.id} className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 text-sm dark:border-gray-700">
                            <div className="min-w-0 flex-1">
                                <p className="font-medium">{report.reason}</p>
                                <p className="truncate text-xs text-gray-500">
                                    Reported by {report.user.name} on “{report.post.title}”
                                </p>
                            </div>
                            <a href={`/post/${report.post.id}`} className={`${btn} bg-gray-200 dark:bg-gray-700`}>
                                View
                            </a>
                            <button
                                onClick={() => router.post(`/admin/reports/${report.id}/dismiss`, {}, { preserveScroll: true })}
                                className={`${btn} bg-blue-900 text-white`}
                            >
                                Dismiss
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </PublicLayout>
    );
}
