import { Star } from '@phosphor-icons/react';

type BrandMarkVariant = 'default' | 'onNav';

const variants: Record<BrandMarkVariant, { shell: string; text: string }> = {
    default: {
        shell: 'bg-primary',
        text: 'text-primary-foreground',
    },
    onNav: {
        shell: 'bg-nav-foreground',
        text: 'text-nav',
    },
};

export default function BrandMark({
    className = 'size-8 rounded-xl',
    charClass = 'text-base',
    starClass = 'top-1 right-1 size-1.5',
    variant = 'default',
}: {
    className?: string;
    charClass?: string;
    starClass?: string;
    variant?: BrandMarkVariant;
}) {
    const colors = variants[variant];

    return (
        <span className={`relative flex items-center justify-center ${colors.shell} ${className}`}>
            <span className={`font-display leading-none font-semibold ${colors.text} ${charClass}`}>C</span>
            <Star weight="fill" className={`absolute ${colors.text} ${starClass}`} />
        </span>
    );
}
