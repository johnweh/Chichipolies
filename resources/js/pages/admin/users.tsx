import { ArrowCounterClockwise, Prohibit, ShieldCheck, ShieldSlash } from '@phosphor-icons/react';
import { Head, router, usePage } from '@inertiajs/react';
import HeadingSmall from '@/components/heading-small';
import AdminLayout from '@/layouts/admin/layout';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, SharedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Members', href: '/admin/users' }];

interface AdminUser {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
    banned_at: string | null;
    posts_count: number;
}

interface Props {
    users: AdminUser[];
}

const actionBtn =
    'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-300 ease-fluid active:scale-[0.97]';

export default function AdminUsers({ users }: Props) {
    const { auth } = usePage<SharedData>().props;
    const adminCount = users.filter((u) => u.is_admin).length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin — Members" />
            <AdminLayout>
                <HeadingSmall title="Members" description="Everyone with an account, newest first" />

                <div className="divide-y divide-border/70">
                    {users.map((user) => {
                        const isSelf = user.id === auth.user.id;

                        return (
                            <div key={user.id} className="flex items-center gap-3 py-3.5 text-sm">
                                <div className="min-w-0 flex-1">
                                    <p className="font-medium text-foreground">
                                        {user.name}
                                        {isSelf && <span className="ml-2 text-xs text-muted-foreground">(you)</span>}
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
                                    <p className="mt-0.5 truncate text-xs text-muted-foreground tabular-nums">
                                        {user.email} &middot; {user.posts_count} posts
                                    </p>
                                </div>

                                {!user.is_admin && !user.banned_at && (
                                    <button
                                        onClick={() =>
                                            confirm(`Make ${user.name} an admin? They will be able to moderate everything.`) &&
                                            router.post(`/admin/users/${user.id}/promote`, {}, { preserveScroll: true })
                                        }
                                        className={`${actionBtn} text-primary hover:bg-primary/10`}
                                    >
                                        <ShieldCheck weight="light" className="size-3.5" />
                                        Make admin
                                    </button>
                                )}

                                {user.is_admin && !isSelf && adminCount > 1 && (
                                    <button
                                        onClick={() =>
                                            confirm(`Remove ${user.name}'s admin access?`) &&
                                            router.post(`/admin/users/${user.id}/demote`, {}, { preserveScroll: true })
                                        }
                                        className={`${actionBtn} text-muted-foreground hover:bg-secondary hover:text-foreground`}
                                    >
                                        <ShieldSlash weight="light" className="size-3.5" />
                                        Remove admin
                                    </button>
                                )}

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
                        );
                    })}
                </div>
            </AdminLayout>
        </AppLayout>
    );
}
