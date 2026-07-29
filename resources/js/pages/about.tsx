import { Head, Link } from '@inertiajs/react';
import Reveal from '@/components/reveal';
import PublicLayout from '@/layouts/public-layout';

const steps = [
    {
        title: 'Citizens report',
        body: 'Anyone signed in can submit a story from any of Liberia\'s 15 counties. Add what you saw, a photo if you have one, and the category that fits best.',
    },
    {
        title: 'Community votes',
        body: 'Readers mark stories as likely true or likely false. After enough votes, a story earns a verification label everyone can see at a glance.',
    },
    {
        title: 'Neighbours discuss',
        body: 'Comments add context, corrections and eyewitness detail. Active discussions surface in the feed so important stories stay visible.',
    },
    {
        title: 'Moderators safeguard',
        body: 'Reported abuse is reviewed by our moderation team. Guidelines, privacy rules and terms keep the platform accountable.',
    },
];

const links = [
    { href: '/search', label: 'Search stories' },
    { href: '/guidelines', label: 'Community guidelines' },
    { href: '/privacy', label: 'Privacy policy' },
    { href: '/terms', label: 'Terms of service' },
];

export default function About() {
    return (
        <PublicLayout>
            <Head title="About" />

            <Reveal>
                <span className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-[10px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                    Our mission
                </span>
                <h1 className="font-display mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                    News by the people who live it
                </h1>
                <p className="mt-4 max-w-[60ch] text-[15px] leading-[1.75] text-foreground/85">
                    Chichipolies is Liberia&rsquo;s community-driven news platform. Citizens across all 15 counties report what is
                    happening around them &mdash; from Montserrado to Maryland &mdash; and the community votes on whether each story
                    is true. No gatekeepers, no rumour mills: just neighbours keeping each other informed and honest.
                </p>
            </Reveal>

            <Reveal delay={120} className="mt-12">
                <h2 className="font-display text-xl font-semibold text-foreground">How it works</h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {steps.map((step, i) => (
                        <div key={step.title} className="rounded-2xl bg-card p-5 shadow-soft ring-1 ring-border/60">
                            <span className="font-display text-2xl font-semibold text-primary/40 tabular-nums">
                                {String(i + 1).padStart(2, '0')}
                            </span>
                            <h3 className="mt-2 text-sm font-semibold text-foreground">{step.title}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                        </div>
                    ))}
                </div>
            </Reveal>

            <Reveal delay={160} className="mt-12">
                <h2 className="font-display text-xl font-semibold text-foreground">Useful links</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="rounded-full border border-input bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </Reveal>

            <Reveal delay={200} className="mt-12">
                <h2 className="font-display text-xl font-semibold text-foreground">Community guidelines</h2>
                <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-muted-foreground">
                    Honest reporting, civil discussion and prompt abuse reporting keep Chichipolies trustworthy. Read the full
                    guidelines for detail on voting, moderation and what we remove.
                </p>
                <Link
                    href="/guidelines"
                    className="mt-4 inline-flex rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                    Read community guidelines
                </Link>
            </Reveal>

            <Reveal delay={240} className="mt-12 rounded-2xl bg-card p-6 shadow-soft ring-1 ring-border/60">
                <h2 className="font-display text-lg font-semibold text-foreground">Contact</h2>
                <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-muted-foreground">
                    Questions about the platform, moderation or your account? Email{' '}
                    <a href="mailto:hello@chichipolies.com" className="font-medium text-primary hover:underline">
                        hello@chichipolies.com
                    </a>{' '}
                    and we will respond as soon as we can.
                </p>
            </Reveal>
        </PublicLayout>
    );
}
