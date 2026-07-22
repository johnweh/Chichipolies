import { Scales, SealCheck, SealQuestion, XCircle, type Icon } from '@phosphor-icons/react';

const config: Record<string, { classes: string; BadgeIcon: Icon }> = {
    'Unverified': {
        classes: 'text-muted-foreground ring-border bg-secondary/60',
        BadgeIcon: SealQuestion,
    },
    'Likely True': {
        classes: 'text-emerald-700 ring-emerald-600/20 bg-emerald-600/10 dark:text-emerald-400 dark:ring-emerald-400/20 dark:bg-emerald-400/10',
        BadgeIcon: SealCheck,
    },
    'Likely False': {
        classes: 'text-red-700 ring-red-600/20 bg-red-600/10 dark:text-red-400 dark:ring-red-400/20 dark:bg-red-400/10',
        BadgeIcon: XCircle,
    },
    'Disputed': {
        classes: 'text-amber-700 ring-amber-600/25 bg-amber-500/10 dark:text-amber-400 dark:ring-amber-400/25 dark:bg-amber-400/10',
        BadgeIcon: Scales,
    },
};

export default function VerificationBadge({ status }: { status: string }) {
    const { classes, BadgeIcon } = config[status] ?? config.Unverified;

    return (
        <span
            className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-[0.08em] uppercase ring-1 ring-inset ${classes}`}
        >
            <BadgeIcon weight="fill" className="size-3" />
            {status}
        </span>
    );
}
