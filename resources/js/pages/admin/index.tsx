import { ArrowCounterClockwise, ArrowUpRight, Check, Prohibit, Trash } from '@phosphor-icons/react';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import Reveal from '@/components/reveal';
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

const actionBtn =
    'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-300 ease-fluid active:scale-[0.97]';

export default function AdminIndex({ posts, users, reports }: Props) {
    const [tab, setTab] = useState<(typeof tabs)[number]>('Posts');

    return (
        <PublicLayout>
            <Head title="Admin" />

            <Reveal>
                <span className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-[10px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                    Moderation
                </span>
                <h1 className="font-display mt-4 text-3xl font-semibold tracking-tight text-foreground">Admin</h1>
            </Reveal>

            <Reveal delay={100} className="mt-6">
                <div className="inline-flex rounded-full bg-secondary p-1">
                    {tabs.map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm transition-all duration-300 ease-fluid ${
                                tab === t ? 'bg-card font-semibold text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            {t}
                            {t === 'Reports' && reports.length > 0 && (
                                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white tabular-nums">
                                    {reports.length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </Reveal>

            <Reveal delay={160} className="mt-5">
                <div className="rounded-[1.75rem] bg-foreground/[0.03] p-1.5 ring-1 ring-border/70">
                    <div className="divide-y divide-border/70 overflow-hidden rounded-[calc(1.75rem-0.375rem)] bg-card">
                        {tab === 'Posts' &&
                            posts.data.map((post) => (
                                <div key={post.id} className="flex items-center gap-3 px-5 py-4 text-sm">
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-medium text-foreground">{post.title}</p>
                                        <p className="mt-0.5 text-xs text-muted-foreground">
                                            {post.user.name} &middot; {post.category} &middot; {post.county} &middot; {post.verification_status}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() =>
                                            confirm('Delete this post?') && router.delete(`/admin/posts/${post.id}`, { preserveScroll: true })
                                        }
                                        className={`${actionBtn} text-red-600 hover:bg-red-600/10`}
                                    >
                                        <Trash weight="light" className="size-3.5" />
                                        Delete
                                    </button>
                                </div>
                            ))}

                        {tab === 'Users' &&
                            users.map((user) => (
                                <div key={user.id} className="flex items-center gap-3 px-5 py-4 text-sm">
                                    <div className="min-w-0 flex-1">
                                        <p className="font-medium text-foreground">
                                            {user.name}
                                            {user.is_admin && (
                                                <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary uppercase">
                                                    Admin
                                                </span>
                                            )}
                                            {user.banned_at && (
                                                <span className="ml-2 rounded-full bg-red-600/10 px-2 py-0.5 text-[10px] font-semibold text-red-600 uppercase">
                                                    Banned
                                                </span>
                                            )}
                                        </p>
                                        <p className="mt-0.5 text-xs text-muted-foreground tabular-nums">
                                            {user.email} &middot; {user.posts_count} posts
                                        </p>
                                    </div>
                                    {!user.is_admin &&
                                        (user.banned_at ? (
                                            <button
                                                onClick={() => router.post(`/admin/users/${user.id}/unban`, {}, { preserveScroll: true })}
                                                className={`${actionBtn} text-muted-foreground hover:bg-secondary hover:text-foreground`}
                                            >
                                                <ArrowCounterClockwise weight="light" className="size-3.5" />
                                                Unban
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => router.post(`/admin/users/${user.id}/ban`, {}, { preserveScroll: true })}
                                                className={`${actionBtn} text-red-600 hover:bg-red-600/10`}
                                            >
                                                <Prohibit weight="light" className="size-3.5" />
                                                Ban
                                            </button>
                                        ))}
                                </div>
                            ))}

                        {tab === 'Reports' && reports.length === 0 && (
                            <p className="px-5 py-12 text-center text-sm text-muted-foreground">No pending reports. All clear.</p>
                        )}
                        {tab === 'Reports' &&
                            reports.map((report) => (
                                <div key={report.id} className="flex items-center gap-3 px-5 py-4 text-sm">
                                    <div className="min-w-0 flex-1">
                                        <p className="font-medium text-foreground">{report.reason}</p>
                                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                            Reported by {report.user.name} on &ldquo;{report.post.title}&rdquo;
                                        </p>
                                    </div>
                                    <a
                                        href={`/post/${report.post.id}`}
                                        className={`${actionBtn} text-muted-foreground hover:bg-secondary hover:text-foreground`}
                                    >
                                        View
                                        <ArrowUpRight weight="bold" className="size-3" />
                                    </a>
                                    <button
                                        onClick={() => router.post(`/admin/reports/${report.id}/dismiss`, {}, { preserveScroll: true })}
                                        className={`${actionBtn} bg-primary text-primary-foreground hover:opacity-90`}
                                    >
                                        <Check weight="bold" className="size-3.5" />
                                        Dismiss
                                    </button>
                                </div>
                            ))}
                    </div>
                </div>
            </Reveal>
        </PublicLayout>
    );
}
