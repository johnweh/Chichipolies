import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import PublicLayout from '@/layouts/public-layout';

interface Props {
    categories: string[];
    counties: string[];
}

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

    const field = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900';
    const error = (key: keyof typeof errors) => errors[key] && <p className="mt-1 text-xs text-red-600">{errors[key]}</p>;

    return (
        <PublicLayout>
            <Head title="Post a Story" />
            <h1 className="text-xl font-bold">Post a Story</h1>
            <form onSubmit={submit} className="mt-4 flex flex-col gap-4">
                <div>
                    <input
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        placeholder="Short, catchy title for your story"
                        className={field}
                    />
                    {error('title')}
                </div>
                <div>
                    <textarea
                        value={data.body}
                        onChange={(e) => setData('body', e.target.value)}
                        placeholder="What happened? Give as many details as you can. Who, what, when, where..."
                        rows={6}
                        className={field}
                    />
                    {error('body')}
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <select value={data.category} onChange={(e) => setData('category', e.target.value)} className={field}>
                            <option value="">What type of story is this?</option>
                            {categories.map((c) => (
                                <option key={c}>{c}</option>
                            ))}
                        </select>
                        {error('category')}
                    </div>
                    <div>
                        <select value={data.county} onChange={(e) => setData('county', e.target.value)} className={field}>
                            <option value="">Select a county</option>
                            {counties.map((c) => (
                                <option key={c}>{c}</option>
                            ))}
                        </select>
                        {error('county')}
                    </div>
                </div>
                <div>
                    <label className="text-sm font-medium">Photo (optional)</label>
                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(e) => setData('photo', e.target.files?.[0] ?? null)}
                        className="mt-1 block w-full text-sm"
                    />
                    {error('photo')}
                </div>
                <div>
                    <label className="text-sm font-medium">Video link (optional)</label>
                    <input
                        value={data.video_url}
                        onChange={(e) => setData('video_url', e.target.value)}
                        placeholder="https://youtube.com/watch?v=... or TikTok / Facebook link"
                        className={`${field} mt-1`}
                    />
                    {error('video_url')}
                </div>
                <button
                    type="button"
                    onClick={improve}
                    disabled={improving || !data.title || !data.body}
                    className="rounded-lg border border-blue-900 px-4 py-2 text-sm font-medium text-blue-900 disabled:opacity-50 dark:border-blue-300 dark:text-blue-300"
                >
                    {improving ? 'Improving…' : '✨ Improve my story'}
                </button>
                <button
                    type="submit"
                    disabled={processing}
                    className="rounded-lg bg-blue-900 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                >
                    {processing ? 'Posting…' : 'Post Story'}
                </button>
            </form>
        </PublicLayout>
    );
}
