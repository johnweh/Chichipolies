import Heading from '@/components/heading';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="px-4 py-6">
            <Heading title="Admin" description="Moderate stories, members and reports" />

            <div className="max-w-3xl">
                <section className="space-y-6">{children}</section>
            </div>
        </div>
    );
}
