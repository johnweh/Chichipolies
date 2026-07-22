import { CheckCircle } from '@phosphor-icons/react';
import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function FlashToast() {
    const { flash } = usePage<{ flash: { success?: string | null } }>().props;
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!flash.success) return;
        setMessage(flash.success);
        setVisible(true);
        const timer = setTimeout(() => setVisible(false), 3500);
        return () => clearTimeout(timer);
    }, [flash]);

    if (!message) return null;

    return (
        <div
            role="status"
            aria-live="polite"
            className={`fixed inset-x-0 bottom-20 z-50 flex justify-center px-4 sm:bottom-8 ${visible ? '' : 'pointer-events-none'}`}
        >
            <div
                className={`flex items-center gap-2.5 rounded-full border border-emerald-600/20 bg-card py-2.5 pr-5 pl-3.5 text-sm font-medium text-foreground shadow-[0_12px_40px_-12px_hsl(30,20%,20%,0.3)] transition-all duration-500 ease-fluid ${
                    visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}
            >
                <CheckCircle weight="fill" className="size-5 text-emerald-600 dark:text-emerald-400" />
                {message}
            </div>
        </div>
    );
}
