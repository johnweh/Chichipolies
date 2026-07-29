import { Head, Link } from '@inertiajs/react';
import Reveal from '@/components/reveal';
import PublicLayout from '@/layouts/public-layout';

const sections = [
    {
        title: 'Acceptance of terms',
        body: 'By accessing or using Chichipolies, you agree to these terms of service and to our community guidelines. If you do not agree, do not use the platform.',
    },
    {
        title: 'The service',
        body: 'Chichipolies is a community news platform where citizens in Liberia can report local stories and vote on whether they believe those stories are true. Verification labels reflect community votes, not professional editorial judgment. We do not guarantee the accuracy of user-submitted content.',
    },
    {
        title: 'Your account',
        body: 'You are responsible for keeping your login credentials secure and for activity under your account. You must provide accurate registration information. We may suspend or terminate accounts that violate these terms or our guidelines.',
    },
    {
        title: 'User content',
        body: 'You retain ownership of content you submit. By posting, you grant Chichipolies a non-exclusive licence to display, store and distribute that content on the platform. You confirm you have the right to post it and that it does not infringe anyone else\'s rights.',
    },
    {
        title: 'Prohibited conduct',
        body: 'You must not post unlawful, threatening, hateful or harassing content; spread deliberate misinformation; spam the platform; attempt to manipulate votes; impersonate others; or interfere with the security or operation of the service.',
    },
    {
        title: 'Moderation',
        body: 'We may remove content, restrict features or ban users where we reasonably believe there has been a breach of these terms or our guidelines. Moderators act to keep the community safe; their decisions are made in good faith but are not subject to appeal unless we offer one in writing.',
    },
    {
        title: 'Disclaimer of warranties',
        body: 'Chichipolies is provided on an "as is" basis. We do not warrant uninterrupted or error-free operation. Community verification is a signal, not a guarantee of truth.',
    },
    {
        title: 'Limitation of liability',
        body: 'To the fullest extent permitted by law, Chichipolies and its operators are not liable for indirect, incidental or consequential damages arising from your use of the platform or reliance on user-submitted content.',
    },
    {
        title: 'Changes',
        body: 'We may update these terms from time to time. Continued use after changes are published constitutes acceptance of the revised terms. Material changes will be noted on this page.',
    },
];

export default function Terms() {
    return (
        <PublicLayout>
            <Head title="Terms of service" />

            <Reveal>
                <span className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-[10px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                    Legal
                </span>
                <h1 className="font-display mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                    Terms of service
                </h1>
                <p className="mt-4 max-w-[60ch] text-[15px] leading-[1.75] text-foreground/85">
                    These terms govern your use of Chichipolies. Please read them alongside our privacy policy and
                    community guidelines. Last updated: July 2026.
                </p>
            </Reveal>

            <Reveal delay={120} className="mt-10">
                <div className="space-y-8">
                    {sections.map((section) => (
                        <section key={section.title}>
                            <h2 className="font-display text-lg font-semibold text-foreground">{section.title}</h2>
                            <p className="mt-2 max-w-[65ch] text-sm leading-relaxed text-muted-foreground">{section.body}</p>
                        </section>
                    ))}
                </div>
            </Reveal>

            <Reveal delay={180} className="mt-12">
                <h2 className="font-display text-lg font-semibold text-foreground">Related pages</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                    <Link href="/privacy" className="rounded-full border border-input bg-card px-4 py-2 text-sm font-medium text-foreground hover:border-primary hover:text-primary">
                        Privacy policy
                    </Link>
                    <Link href="/guidelines" className="rounded-full border border-input bg-card px-4 py-2 text-sm font-medium text-foreground hover:border-primary hover:text-primary">
                        Community guidelines
                    </Link>
                    <Link href="/about" className="rounded-full border border-input bg-card px-4 py-2 text-sm font-medium text-foreground hover:border-primary hover:text-primary">
                        About Chichipolies
                    </Link>
                </div>
            </Reveal>
        </PublicLayout>
    );
}
