import { ArrowUpRight, Check } from '@phosphor-icons/react';
import { Head, Link, router } from '@inertiajs/react';
import HeadingSmall from '@/components/heading-small';
import AdminLayout from '@/layouts/admin/layout';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Reports', href: '/admin/reports' }];

interface PendingReport {
    id: number;
    reason: string;
    created_at: string;
    post: { id: number; title: string };
    user: { id: number; name: string };
}

interface Props {
    reports: PendingReport[];
}

export default function AdminReports({ reports }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin — Reports" />
            <AdminLayout>
                <HeadingSmall title="Reports" description="Pending abuse reports from the community" />

                <div className="divide-y divide-border/70">
                    {reports.length === 0 && <p className="py-8 text-sm text-muted-foreground">No pending reports. All clear.</p>}
                    {reports.map((report) => (
                        <div key={report.id} className="flex items-center gap-3 py-3.5 text-sm">
                            <div className="min-w-0 flex-1">
                                <p className="font-medium text-foreground">{report.reason}</p>
                                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                    Reported by {report.user.name} on &ldquo;{report.post.title}&rdquo;
                                </p>
                            </div>
                            <Link
                                href={`/post/${report.post.id}`}
                                className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all duration-300 ease-fluid hover:bg-secondary hover:text-foreground active:scale-[0.97]"
                            >
                                View
                                <ArrowUpRight weight="bold" className="size-3" />
                            </Link>
                            <button
                                onClick={() => router.post(`/admin/reports/${report.id}/dismiss`, {}, { preserveScroll: true })}
                                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-all duration-300 ease-fluid hover:opacity-90 active:scale-[0.97]"
                            >
                                <Check weight="bold" className="size-3.5" />
                                Dismiss
                            </button>
                        </div>
                    ))}
                </div>
            </AdminLayout>
        </AppLayout>
    );
}
