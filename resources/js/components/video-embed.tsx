import { ArrowUpRight, Play } from '@phosphor-icons/react';

export default function VideoEmbed({ url }: { url: string }) {
    const youtube = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{6,})/);

    if (youtube) {
        return (
            <div className="rounded-[1.75rem] bg-foreground/[0.03] p-1.5 ring-1 ring-border/70">
                <div className="aspect-video overflow-hidden rounded-[calc(1.75rem-0.375rem)]">
                    <iframe src={`https://www.youtube.com/embed/${youtube[1]}`} className="h-full w-full" allowFullScreen title="Video" />
                </div>
            </div>
        );
    }

    const label = url.includes('tiktok.com')
        ? 'Watch on TikTok'
        : url.includes('facebook.com') || url.includes('fb.watch')
          ? 'Watch on Facebook'
          : 'Watch video';

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 rounded-2xl border border-input bg-card px-4 py-3.5 text-sm font-medium text-foreground transition-all duration-300 ease-fluid hover:bg-secondary active:scale-[0.99]"
        >
            <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Play weight="fill" className="size-4" />
            </span>
            {label}
            <ArrowUpRight
                weight="bold"
                className="ml-auto size-4 text-muted-foreground transition-transform duration-300 ease-fluid group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
        </a>
    );
}
