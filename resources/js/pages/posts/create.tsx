import { ArrowUpRight, Image, Sparkle } from '@phosphor-icons/react';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Reveal from '@/components/reveal';
import PublicLayout from '@/layouts/public-layout';

interface Props {
    categories: string[];
    counties: string[];
}

const field =
    'w-full rounded-2xl border border-input bg-card px-4 py-2.5 text-sm text-foreground transition-all duration-300 ease-fluid focus:border-ring focus:ring-2 focus:ring-ring/25 focus:outline-none';

export default function PostCreate({ categories, counties }: Props) {
    const { data, setData, post, processing, errors } = useForm<{
        title: string;
        body: string;
        category: string;
        county: string;
        photo: File | null;
        video_url: string;
    }>({ title: '', body: '', category: '', county: '', photo: null, video_url: '' });

    const [improving, setImproving] = useState(false);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/submit');
    };

    const improve = async () => {
        setImproving(true);
        try {
            const res = await fetch('/ai/improve-post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] ?? ''),
                },
                body: JSON.stringify({ title: data.title, body: data.body }),
            });
            if (!res.ok) throw new Error();
            const improved = await res.json();
            setData((d) => ({ ...d, title: improved.title, body: improved.body }));
        } catch {
            alert('AI helper is unavailable right now.');
        } finally {
            setImproving(false);
        }
    };

    const error = (key: keyof typeof errors) => errors[key] && <p className="mt-1.5 text-xs text-red-600">{errors[key]}</p>;
    const label = (text: string, hint?: string) => (
        <label className="mb-1.5 block text-xs font-semibold tracking-[0.06em] text-muted-foreground uppercase">
            {text}
            {hint && <span className="ml-1.5 font-normal normal-case tracking-normal opacity-70">{hint}</span>}
        </label>
    );

    return (
        <PublicLayout>
            <Head title="Post a Story" />

            <Reveal>
                <span className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-[10px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                    Citizen report
                </span>
                <h1 className="font-display mt-4 text-3xl font-semibold tracking-tight text-foreground">Post a story</h1>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                    Report what you saw, not what you heard. The community will vote on whether it&rsquo;s true.
                </p>
            </Reveal>

            <Reveal delay={120} className="mt-8">
                <div className="rounded-[1.75rem] bg-foreground/[0.03] p-1.5 ring-1 ring-border/70">
                    <form
                        onSubmit={submit}
                        className="flex flex-col gap-5 rounded-[calc(1.75rem-0.375rem)] bg-card p-5 shadow-[inset_0_1px_1px_hsl(40,30%,100%,0.4)] sm:p-7 dark:shadow-none"
                    >
                        <div>
                            {label('Title')}
                            <input
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="Short, clear headline for your story"
                                className={field}
                            />
                            {error('title')}
                        </div>

                        <div>
                            {label('What happened?')}
                            <textarea
                                value={data.body}
                                onChange={(e) => setData('body', e.target.value)}
                                placeholder="Give as many details as you can. Who, what, when, where."
                                rows={7}
                                className={`${field} resize-y rounded-2xl leading-relaxed`}
                            />
                            {error('body')}
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                {label('Category')}
                                <select value={data.category} onChange={(e) => setData('category', e.target.value)} className={field}>
                                    <option value="">Choose a category</option>
                                    {categories.map((c) => (
                                        <option key={c}>{c}</option>
                                    ))}
                                </select>
                                {error('category')}
                            </div>
                            <div>
                                {label('County')}
                                <select value={data.county} onChange={(e) => setData('county', e.target.value)} className={field}>
                                    <option value="">Choose a county</option>
                                    {counties.map((c) => (
                                        <option key={c}>{c}</option>
                                    ))}
                                </select>
                                {error('county')}
                            </div>
                        </div>

                        <div>
                            {label('Photo', 'optional — JPEG, PNG or WebP, up to 5 MB')}
                            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-input bg-background/50 px-4 py-3.5 text-sm text-muted-foreground transition-colors duration-300 ease-fluid hover:border-ring/60 hover:text-foreground">
                                <Image weight="light" className="size-5 shrink-0" />
                                <span className="truncate">{data.photo ? data.photo.name : 'Choose a photo from your device'}</span>
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={(e) => setData('photo', e.target.files?.[0] ?? null)}
                                    className="sr-only"
                                />
                            </label>
                            {error('photo')}
                        </div>

                        <div>
                            {label('Video link', 'optional — YouTube, TikTok or Facebook')}
                            <input
                                value={data.video_url}
                                onChange={(e) => setData('video_url', e.target.value)}
                                placeholder="https://youtube.com/watch?v="
                                className={field}
                            />
                            {error('video_url')}
                        </div>

                        <div className="mt-1 flex flex-col gap-2.5 sm:flex-row sm:items-center">
                            <button
                                type="button"
                                onClick={improve}
                                disabled={improving || !data.title || !data.body}
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-input bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-all duration-300 ease-fluid hover:bg-secondary active:scale-[0.98] disabled:opacity-40"
                            >
                                <Sparkle weight={improving ? 'fill' : 'light'} className={`size-4 ${improving ? 'animate-pulse' : ''}`} />
                                {improving ? 'Improving your story' : 'Improve my story'}
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary py-2 pr-2 pl-5 text-sm font-semibold text-primary-foreground transition-all duration-300 ease-fluid hover:opacity-90 active:scale-[0.98] disabled:opacity-50 sm:ml-auto"
                            >
                                {processing ? 'Posting' : 'Post story'}
                                <span className="flex size-7 items-center justify-center rounded-full bg-primary-foreground/15 transition-transform duration-300 ease-fluid group-hover:translate-x-0.5 group-hover:-translate-y-px">
                                    <ArrowUpRight weight="bold" className="size-3.5" />
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
            </Reveal>
        </PublicLayout>
    );
}
