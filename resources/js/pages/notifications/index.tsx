import { Bell, ChatCircle, CheckCircle, XCircle } from '@phosphor-icons/react';
import { Head, Link } from '@inertiajs/react';
import Reveal from '@/components/reveal';
import PublicLayout from '@/layouts/public-layout';
import { timeAgo } from '@/lib/time';
import type { NotificationItem } from '@/types/chichipolies';

interface Props {
    items: NotificationItem[];
}

export default function NotificationsIndex({ items }: Props) {
    return (
        <PublicLayout>
            <Head title="Notifications" />

            <Reveal>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-[10px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                    <Bell weight="fill" className="size-3 text-primary" />
                    Activity
                </span>
                <h1 className="font-display mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                    Notifications
                </h1>
                <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-muted-foreground">
                    Comments and votes on stories you reported. Open a story to reply or see how verification is shifting.
                </p>
            </Reveal>

            <Reveal delay={120} className="mt-8">
                {items.length > 0 ? (
                    <div className="overflow-hidden rounded-2xl bg-card shadow-soft ring-1 ring-border/60">
                        <ul className="divide-y divide-border/70">
                            {items.map((item) => (
                                <li key={item.id}>
                                    <Link
                                        href={`/post/${item.post.id}`}
                                        className="flex gap-4 px-5 py-4 transition-colors hover:bg-secondary/40 sm:px-6"
                                    >
                                        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                                            {item.type === 'comment' ? (
                                                <ChatCircle weight="fill" className="size-4" />
                                            ) : item.is_true ? (
                                                <CheckCircle weight="fill" className="size-4 text-emerald-600" />
                                            ) : (
                                                <XCircle weight="fill" className="size-4 text-red-600" />
                                            )}
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm text-foreground">
                                                <span className="font-semibold">{item.actor.name}</span>
                                                {item.type === 'comment'
                                                    ? ' commented on your story'
                                                    : item.is_true
                                                      ? ' voted True on your story'
                                                      : ' voted False on your story'}
                                            </p>
                                            <p className="mt-1 line-clamp-1 text-sm font-medium text-foreground/90">
                                                {item.post.title}
                                            </p>
                                            {item.type === 'comment' && item.body && (
                                                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.body}</p>
                                            )}
                                            <p className="mt-2 text-xs text-muted-foreground">{timeAgo(item.created_at)}</p>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-2xl bg-card shadow-soft ring-1 ring-border/60">
                        <div className="flex flex-col items-center px-6 py-16 text-center">
                            <span className="flex size-12 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                                <Bell weight="light" className="size-6" />
                            </span>
                            <h2 className="mt-4 text-lg font-semibold text-foreground">Nothing new yet</h2>
                            <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                                When someone comments on or votes on your stories, you will see it here.
                            </p>
                            <Link
                                href="/submit"
                                className="mt-6 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                            >
                                Post a story
                            </Link>
                        </div>
                    </div>
                )}
            </Reveal>
        </PublicLayout>
    );
}
