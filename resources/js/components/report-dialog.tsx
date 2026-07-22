import { useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function ReportDialog({ postId, reasons }: { postId: number; reasons: string[] }) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, reset } = useForm({ reason: '' });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/post/${postId}/report`, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setOpen(false);
            },
        });
    };

    return (
        <>
            <button onClick={() => setOpen(true)} className="text-xs text-gray-500 hover:text-red-600">
                ⚑ Report
            </button>
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setOpen(false)}>
                    <form
                        onSubmit={submit}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-sm rounded-xl bg-white p-5 dark:bg-gray-900"
                    >
                        <h3 className="font-semibold">Report abuse</h3>
                        <select
                            value={data.reason}
                            onChange={(e) => setData('reason', e.target.value)}
                            className="mt-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                            required
                        >
                            <option value="">Select a reason</option>
                            {reasons.map((r) => (
                                <option key={r}>{r}</option>
                            ))}
                        </select>
                        <div className="mt-4 flex justify-end gap-2">
                            <button type="button" onClick={() => setOpen(false)} className="rounded-lg px-3 py-1.5 text-sm">
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={processing || !data.reason}
                                className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
                            >
                                Report
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}
