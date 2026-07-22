import { Star } from '@phosphor-icons/react';

export default function BrandMark({
    className = 'size-8 rounded-xl',
    charClass = 'text-base',
    starClass = 'top-1 right-1 size-1.5',
}: {
    className?: string;
    charClass?: string;
    starClass?: string;
}) {
    return (
        <span className={`relative flex items-center justify-center bg-primary ${className}`}>
            <span className={`font-display leading-none font-semibold text-primary-foreground ${charClass}`}>C</span>
            <Star weight="fill" className={`absolute text-primary-foreground ${starClass}`} />
        </span>
    );
}
