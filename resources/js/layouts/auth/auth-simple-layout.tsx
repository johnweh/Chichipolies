import { Star } from '@phosphor-icons/react';
import { Link } from '@inertiajs/react';

interface AuthLayoutProps {
    children: React.ReactNode;
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: AuthLayoutProps) {
    return (
        <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className="mb-8 flex flex-col items-center gap-4 text-center">
                    <Link href={route('home')} className="flex flex-col items-center gap-3">
                        <span className="relative flex size-11 items-center justify-center rounded-2xl bg-primary shadow-[0_8px_24px_-8px_hsl(220,62%,28%,0.5)]">
                            <span className="font-display text-2xl leading-none font-semibold text-primary-foreground">C</span>
                            <Star weight="fill" className="absolute top-1.5 right-1.5 size-2.5 text-primary-foreground" />
                        </span>
                        <span className="font-display text-lg font-semibold tracking-tight text-foreground">Chichipolies</span>
                    </Link>
                    <div>
                        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
                        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{description}</p>
                    </div>
                </div>

                <div className="rounded-3xl bg-card shadow-soft ring-1 ring-border/60">
                    <div className="rounded-3xl bg-card p-6">
                        {children}
                    </div>
                </div>

                <p className="mt-6 text-center text-xs text-muted-foreground">
                    <Link href={route('home')} className="transition-colors hover:text-foreground">
                        Back to the feed
                    </Link>
                </p>
            </div>
        </div>
    );
}
