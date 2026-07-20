export default function VideoEmbed({ url }: { url: string }) {
    const youtube = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{6,})/);

    if (youtube) {
        return (
            <div className="aspect-video overflow-hidden rounded-lg">
                <iframe
                    src={`https://www.youtube.com/embed/${youtube[1]}`}
                    className="h-full w-full"
                    allowFullScreen
                    title="Video"
                />
            </div>
        );
    }

    const label = url.includes('tiktok.com') ? 'TikTok Video' : url.includes('facebook.com') || url.includes('fb.watch') ? 'Facebook Video' : 'Video';

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-lg border border-gray-200 p-4 text-sm font-medium text-blue-900 hover:bg-gray-50 dark:border-gray-700 dark:text-blue-300 dark:hover:bg-gray-800"
        >
            ▶ Watch {label}
        </a>
    );
}
