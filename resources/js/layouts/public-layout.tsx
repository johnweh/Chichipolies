import type { PropsWithChildren } from 'react';

export default function PublicLayout({ children }: PropsWithChildren) {
    return <main className="mx-auto max-w-2xl px-4 py-6">{children}</main>;
}
