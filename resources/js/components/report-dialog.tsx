import { Flag } from '@phosphor-icons/react';
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
            <button
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium text-muted-foreground transition-all duration-300 ease-fluid hover:bg-red-600/10 hover:text-red-600 active:scale-[0.97]"
            >
                <Flag weight="light" className="size-3.5" />
                Report
            </button>
            {open && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
                    onClick={() => setOpen(false)}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Report abuse"
                >
                    <div className="w-full max-w-sm rounded-3xl bg-card shadow-soft ring-1 ring-border/60" onClick={(e) => e.stopPropagation()}>
                        <form onSubmit={submit} className="rounded-3xl bg-card p-5">
                            <h3 className="font-display text-lg font-semibold text-foreground">Report this story</h3>
                            <p className="mt-1 text-xs text-muted-foreground">Our moderators review every report.</p>

                            <div className="mt-4 flex flex-col gap-1.5">
                                {reasons.map((reason) => (
                                    <label
                                        key={reason}
                                        className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-sm transition-all duration-300 ease-fluid ${
                                            data.reason === reason
                                                ? 'border-red-600/40 bg-red-600/10 font-medium text-red-700 dark:text-red-400'
                                                : 'border-input text-foreground hover:bg-secondary'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="reason"
                                            value={reason}
                                            checked={data.reason === reason}
                                            onChange={() => setData('reason', reason)}
                                            className="sr-only"
                                        />
                                        <span
                                            className={`size-2 shrink-0 rounded-full transition-colors duration-300 ${
                                                data.reason === reason ? 'bg-red-600' : 'bg-border'
                                            }`}
                                        />
                                        {reason}
                                    </label>
                                ))}
                            </div>

                            <div className="mt-5 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing || !data.reason}
                                    className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 ease-fluid hover:bg-red-700 active:scale-[0.98] disabled:opacity-40"
                                >
                                    Submit report
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
