import { CaretLeft, CaretRight, Trash } from '@phosphor-icons/react';
import { Head, Link, router } from '@inertiajs/react';
import HeadingSmall from '@/components/heading-small';
import AdminLayout from '@/layouts/admin/layout';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Paginated, PostSummary } from '@/types/chichipolies';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Stories', href: '/admin/posts' }];

interface Props {
    posts: Paginated<PostSummary>;
}

export default function AdminPosts({ posts }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin — Stories" />
            <AdminLayout>
                <HeadingSmall title="Stories" description="Every story on the platform, newest first" />

                <div className="divide-y divide-border/70">
                    {posts.data.map((post) => (
                        <div key={post.id} className="flex items-center gap-3 py-3.5 text-sm">
                            <div className="min-w-0 flex-1">
                                <Link href={`/post/${post.id}`} className="truncate font-medium text-foreground hover:text-primary">
                                    {post.title}
                                </Link>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                    {post.user.name} &middot; {post.category} &middot; {post.county} &middot; {post.verification_status}
                                </p>
                            </div>
                            <button
                                onClick={() => confirm('Delete this post?') && router.delete(`/admin/posts/${post.id}`, { preserveScroll: true })}
                                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-red-600 transition-all duration-300 ease-fluid hover:bg-red-600/10 active:scale-[0.97]"
                            >
                                <Trash weight="light" className="size-3.5" />
                                Delete
                            </button>
                        </div>
                    ))}
                    {posts.data.length === 0 && <p className="py-8 text-sm text-muted-foreground">No stories yet.</p>}
                </div>

                {posts.links.length > 3 && (
                    <nav className="flex flex-wrap gap-1" aria-label="Pagination">
                        {posts.links.map((link, i) => {
                            if (!link.url) return null;
                            const isPrev = link.label.includes('laquo');
                            const isNext = link.label.includes('raquo');

                            return (
                                <Link
                                    key={i}
                                    href={link.url}
                                    className={`flex h-8 min-w-8 items-center justify-center rounded-full px-2.5 text-xs transition-all duration-300 ease-fluid tabular-nums ${
                                        link.active
                                            ? 'bg-primary font-semibold text-primary-foreground'
                                            : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                                    }`}
                                >
                                    {isPrev ? (
                                        <CaretLeft weight="bold" className="size-3" />
                                    ) : isNext ? (
                                        <CaretRight weight="bold" className="size-3" />
                                    ) : (
                                        link.label.replace('&laquo;', '').replace('&raquo;', '').trim()
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                )}
            </AdminLayout>
        </AppLayout>
    );
}
