import { Head, Link } from '@inertiajs/react';
import Reveal from '@/components/reveal';
import PublicLayout from '@/layouts/public-layout';

const guidelines = [
    {
        title: 'Report what you saw',
        body: 'First-hand accounts keep the platform trustworthy. Say what you witnessed, not what you heard second-hand. Include the county, the date if you know it, and enough detail for others to understand what happened.',
    },
    {
        title: 'Vote honestly',
        body: 'Only mark a story true if you have good reason to believe it. Your vote shapes what the community trusts. If you are unsure, leave it unverified rather than guessing.',
    },
    {
        title: 'Keep it civil',
        body: 'No hate speech, no incitement, no personal attacks. Disagree with the story, not the person. Comments should add context, correction or eyewitness detail.',
    },
    {
        title: 'Flag abuse',
        body: 'See spam, misinformation or threats? Report it from the story page. Our moderators review every report and may remove content or restrict accounts that break these rules.',
    },
    {
        title: 'Respect privacy',
        body: 'Do not publish private addresses, phone numbers or other identifying details without good reason. Protect vulnerable people, especially children.',
    },
    {
        title: 'No manipulation',
        body: 'Do not coordinate false votes, post duplicate stories to game the feed, or impersonate officials, journalists or other users.',
    },
];

const enforcement = [
    'First breach: content removal and a warning where appropriate.',
    'Repeated breaches: temporary restrictions on posting, voting or commenting.',
    'Serious abuse: account ban and referral to moderators for review.',
];

export default function Guidelines() {
    return (
        <PublicLayout>
            <Head title="Community guidelines" />

            <Reveal>
                <span className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-[10px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                    Community
                </span>
                <h1 className="font-display mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                    Community guidelines
                </h1>
                <p className="mt-4 max-w-[60ch] text-[15px] leading-[1.75] text-foreground/85">
                    Chichipolies works when citizens report honestly and vote responsibly. These guidelines apply to
                    stories, comments, votes and reports. They sit alongside our{' '}
                    <Link href="/terms" className="font-medium text-primary hover:underline">
                        terms of service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="font-medium text-primary hover:underline">
                        privacy policy
                    </Link>
                    .
                </p>
            </Reveal>

            <Reveal delay={120} className="mt-10">
                <div className="space-y-8">
                    {guidelines.map((guideline, i) => (
                        <section key={guideline.title}>
                            <h2 className="font-display text-lg font-semibold text-foreground">
                                {String(i + 1).padStart(2, '0')}. {guideline.title}
                            </h2>
                            <p className="mt-2 max-w-[65ch] text-sm leading-relaxed text-muted-foreground">{guideline.body}</p>
                        </section>
                    ))}
                </div>
            </Reveal>

            <Reveal delay={180} className="mt-12">
                <h2 className="font-display text-xl font-semibold text-foreground">How moderation works</h2>
                <ul className="mt-4 max-w-[65ch] space-y-2 text-sm leading-relaxed text-muted-foreground">
                    {enforcement.map((item) => (
                        <li key={item} className="flex gap-2">
                            <span aria-hidden className="text-primary">
                                &bull;
                            </span>
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
                <p className="mt-6 max-w-[65ch] text-sm leading-relaxed text-muted-foreground">
                    Moderators aim to act fairly and promptly. If you believe a decision was wrong, contact the team through
                    the details on our{' '}
                    <Link href="/about" className="font-medium text-primary hover:underline">
                        About page
                    </Link>
                    .
                </p>
            </Reveal>
        </PublicLayout>
    );
}
