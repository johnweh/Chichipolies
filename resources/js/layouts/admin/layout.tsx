import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Link, usePage } from '@inertiajs/react';

const sidebarNavItems = [
    { title: 'Stories', url: '/admin/posts' },
    { title: 'Members', url: '/admin/users' },
    { title: 'Reports', url: '/admin/reports' },
];

export default function AdminLayout({ children, pendingReports = 0 }: { children: React.ReactNode; pendingReports?: number }) {
    const currentPath = usePage().url.split('?')[0];

    return (
        <div className="px-4 py-6">
            <Heading title="Admin" description="Moderate stories, members and reports" />

            <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
                <aside className="w-full max-w-xl lg:w-48">
                    <nav className="flex flex-col space-y-1 space-x-0">
                        {sidebarNavItems.map((item) => (
                            <Button
                                key={item.url}
                                size="sm"
                                variant="ghost"
                                asChild
                                className={cn('w-full justify-start', {
                                    'bg-muted': currentPath === item.url,
                                })}
                            >
                                <Link href={item.url} prefetch>
                                    {item.title}
                                    {item.title === 'Reports' && pendingReports > 0 && (
                                        <span className="ml-auto flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white tabular-nums">
                                            {pendingReports}
                                        </span>
                                    )}
                                </Link>
                            </Button>
                        ))}
                    </nav>
                </aside>

                <Separator className="my-6 md:hidden" />

                <div className="flex-1 md:max-w-2xl">
                    <section className="space-y-6">{children}</section>
                </div>
            </div>
        </div>
    );
}
