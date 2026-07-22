import { Head } from '@inertiajs/react';
import Reveal from '@/components/reveal';
import PublicLayout from '@/layouts/public-layout';

const guidelines = [
    {
        title: 'Report what you saw',
        body: 'First-hand accounts keep the platform trustworthy. Say what you witnessed, not what you heard second-hand.',
    },
    {
        title: 'Vote honestly',
        body: 'Only mark a story true if you have good reason to believe it. Your vote shapes what the community trusts.',
    },
    {
        title: 'Keep it civil',
        body: 'No hate speech, no incitement, no personal attacks. Disagree with the story, not the person.',
    },
    {
        title: 'Flag abuse',
        body: 'See spam, misinformation or threats? Report it. Our moderators review every report.',
    },
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

            <Reveal delay={150} className="mt-12">
                <h2 className="font-display text-xl font-semibold text-foreground">Community guidelines</h2>
                <ol className="mt-5 space-y-0 divide-y divide-border/70">
                    {guidelines.map((guideline, i) => (
                        <li key={guideline.title} className="flex gap-5 py-5">
                            <span className="font-display text-2xl leading-none font-semibold text-primary/40 tabular-nums">
                                {String(i + 1).padStart(2, '0')}
                            </span>
                            <div>
                                <h3 className="text-sm font-semibold text-foreground">{guideline.title}</h3>
                                <p className="mt-1 max-w-[55ch] text-sm leading-relaxed text-muted-foreground">{guideline.body}</p>
                            </div>
                        </li>
                    ))}
                </ol>
            </Reveal>
        </PublicLayout>
    );
}
