interface UserAvatarProps {
    name: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const sizes = {
    sm: 'size-7 text-[10px]',
    md: 'size-9 text-xs',
    lg: 'size-11 text-sm',
};

export default function UserAvatar({ name, size = 'md', className = '' }: UserAvatarProps) {
    const initials = name
        .split(' ')
        .slice(0, 2)
        .map((part) => part.charAt(0))
        .join('')
        .toUpperCase();

    return (
        <span
            className={`inline-flex shrink-0 items-center justify-center rounded-full bg-secondary font-semibold text-muted-foreground ${sizes[size]} ${className}`}
            aria-hidden
        >
            {initials}
        </span>
    );
}
