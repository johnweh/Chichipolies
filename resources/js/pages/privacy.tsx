import { Head } from '@inertiajs/react';
import Reveal from '@/components/reveal';
import PublicLayout from '@/layouts/public-layout';

const sections = [
    {
        title: 'Information we collect',
        body: 'When you create an account, we store your name, email address and password (stored securely hashed). When you post a story, comment or vote, we store that content along with a timestamp and your account identifier. We do not sell personal data to third parties.',
    },
    {
        title: 'How we use your information',
        body: 'We use your information to operate Chichipolies: displaying stories and comments, recording community votes, sending account-related messages, and reviewing abuse reports. We may use aggregated, non-identifying statistics to understand how the platform is used.',
    },
    {
        title: 'Cookies and local storage',
        body: 'We use session cookies to keep you signed in and to protect forms against cross-site request forgery. We also store your theme preference locally in your browser. You can clear cookies through your browser settings, though you may need to sign in again.',
    },
    {
        title: 'Content you publish',
        body: 'Stories, comments and votes you submit are visible to other users according to how the platform works. Do not post information you are not willing to share publicly. Moderators may remove content that breaks our community guidelines or terms.',
    },
    {
        title: 'Data retention and deletion',
        body: 'We keep account and content data for as long as your account is active or as needed to operate the service. You may delete your account from settings, which removes your profile. Some content may remain anonymised where required for moderation records.',
    },
    {
        title: 'Your rights',
        body: 'You may request access to, correction of, or deletion of personal data we hold about you by contacting us. We will respond within a reasonable time. Nothing in this policy limits rights you may have under applicable law.',
    },
    {
        title: 'Contact',
        body: 'Questions about this privacy policy or how we handle data can be sent to the Chichipolies team through the contact details published on the About page.',
    },
];

export default function Privacy() {
    return (
        <PublicLayout>
            <Head title="Privacy policy" />

            <Reveal>
                <span className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-[10px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                    Legal
                </span>
                <h1 className="font-display mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                    Privacy policy
                </h1>
                <p className="mt-4 max-w-[60ch] text-[15px] leading-[1.75] text-foreground/85">
                    This policy explains what information Chichipolies collects, how we use it, and the choices you
                    have. We aim to be plain and specific. Last updated: July 2026.
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
        </PublicLayout>
    );
}
