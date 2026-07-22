import { ArrowCounterClockwise, Prohibit } from '@phosphor-icons/react';
import { Head, router } from '@inertiajs/react';
import HeadingSmall from '@/components/heading-small';
import AdminLayout from '@/layouts/admin/layout';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

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

export default function AdminUsers({ users }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin — Members" />
            <AdminLayout>
                <HeadingSmall title="Members" description="Everyone with an account, newest first" />

                <div className="divide-y divide-border/70">
                    {users.map((user) => (
                        <div key={user.id} className="flex items-center gap-3 py-3.5 text-sm">
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
                                <p className="mt-0.5 truncate text-xs text-muted-foreground tabular-nums">
                                    {user.email} &middot; {user.posts_count} posts
                                </p>
                            </div>
                            {!user.is_admin &&
                                (user.banned_at ? (
                                    <button
                                        onClick={() => router.post(`/admin/users/${user.id}/unban`, {}, { preserveScroll: true })}
                                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all duration-300 ease-fluid hover:bg-secondary hover:text-foreground active:scale-[0.97]"
                                    >
                                        <ArrowCounterClockwise weight="light" className="size-3.5" />
                                        Unban
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => router.post(`/admin/users/${user.id}/ban`, {}, { preserveScroll: true })}
                                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-red-600 transition-all duration-300 ease-fluid hover:bg-red-600/10 active:scale-[0.97]"
                                    >
                                        <Prohibit weight="light" className="size-3.5" />
                                        Ban
                                    </button>
                                ))}
                        </div>
                    ))}
                </div>
            </AdminLayout>
        </AppLayout>
    );
}
