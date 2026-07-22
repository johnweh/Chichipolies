import { useEffect, useRef, useState, type PropsWithChildren } from 'react';

interface RevealProps extends PropsWithChildren {
    delay?: number;
    className?: string;
}

export default function Reveal({ children, delay = 0, className = '' }: RevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [shown, setShown] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShown(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '0px 0px -40px 0px' },
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            style={{ transitionDelay: `${delay}ms` }}
            className={`transition-all duration-700 ease-fluid ${shown ? 'translate-y-0 opacity-100 blur-0' : 'translate-y-6 opacity-0 blur-[2px]'} ${className}`}
        >
            {children}
        </div>
    );
}
