import { Head, usePage } from '@inertiajs/react';
import Heading from '@/components/heading';
import Reveal from '@/components/reveal';
import StoryForm from '@/components/story-form';
import AppLayout from '@/layouts/app-layout';
import PublicLayout from '@/layouts/public-layout';
import type { BreadcrumbItem, SharedData } from '@/types';

interface Props {
    categories: string[];
    counties: string[];
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'New story', href: '/submit' }];

export default function PostCreate({ categories, counties }: Props) {
    const { auth } = usePage<SharedData>().props;
    const canPostOfficial = Boolean(auth.user?.is_owner || auth.user?.is_employee);

    if (auth.user?.is_admin) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="New story" />
                <div className="px-4 py-6">
                    <Heading title="New story" description="Publish a story to the feed" />
                    <div className="max-w-2xl">
                        <StoryForm categories={categories} counties={counties} canPostOfficial={canPostOfficial} />
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <PublicLayout>
            <Head title="Post a Story" />

            <Reveal>
                <span className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-[10px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                    {canPostOfficial ? 'Platform story' : 'Citizen report'}
                </span>
                <h1 className="font-display mt-4 text-3xl font-semibold tracking-tight text-foreground">Post a story</h1>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                    Report what you saw, not what you heard. The community will vote on whether it&rsquo;s true.
                </p>
            </Reveal>

            <Reveal delay={120} className="mt-8">
                <div className="rounded-3xl bg-card p-5 shadow-soft ring-1 ring-border/60 sm:p-7">
                    <StoryForm categories={categories} counties={counties} canPostOfficial={canPostOfficial} />
                </div>
            </Reveal>
        </PublicLayout>
    );
}
