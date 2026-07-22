# Chichipolies — Design System

Editorial warmth: cream paper, ink text, one navy accent, serif display type. Both light and dark modes are first-class (light = warm paper, dark = deep flag-navy "Liberian night").

## Colour

Tokens live in `resources/css/app.css` (`:root` / `.dark`). Strategy: **restrained** — tinted warm neutrals + one navy accent.

- Light: background `hsl(40 33% 97%)` (cream), card `hsl(40 30% 99%)`, foreground `hsl(30 12% 12%)` (warm ink), border `hsl(38 16% 88%)`.
- Dark ("Liberian night"): background `hsl(224 25% 7%)` deep flag-navy, card `hsl(224 22% 10%)`, foreground `hsl(220 22% 92%)` star-white; all dark neutrals are navy-tinted (the dark theme is the blue canton).
- Primary (single accent): `hsl(220 62% 28%)` Liberian-flag blue (light) / `hsl(219 58% 70%)` (dark). Brand hex for meta/manifest: `#1B3874`. Flag red is deliberately NOT a brand colour: red stays semantic-only (Likely False / report / ban).
- Semantic status only: emerald (Likely True), red (Likely False), amber (Disputed), muted grey (Unverified). Always at /10–/20 tints with matching text colour, never saturated fills except active vote buttons.
- Light-mode greys are warm-tinted; dark-mode greys are navy-tinted. Never `#000`/`#fff`.

## Typography

- Display: **Fraunces** (variable serif) — masthead, page titles, story headlines, section headings. Utility: `font-display`. Tight tracking on large sizes.
- Body/UI: **Plus Jakarta Sans** — everything else (`--font-sans`).
- Eyebrows/labels: 10–11px, uppercase, `tracking-[0.06em]`–`[0.2em]`, semibold, muted.
- Counts and data: `tabular-nums`.
- Body copy: max `65ch`, `leading-[1.75]` for article text.
- **Banned:** Inter, Roboto, Arial, system default stacks as the visible face.

## Surfaces — the double-bezel

Major containers (list shell, panels, forms, media, dialogs) use the nested pattern:

```
outer: rounded-[1.75rem] bg-foreground/[0.03] p-1.5 ring-1 ring-border/70
inner: rounded-[calc(1.75rem-0.375rem)] bg-card
       + shadow-[inset_0_1px_1px_hsl(40,30%,100%,0.4)] (light only)
```

List rows separate with `divide-y divide-border/70` hairlines — no bordered cards, no nested cards.

## Iconography

**Phosphor** (`@phosphor-icons/react`), `weight="light"` default, `fill` for active/selected states. **No emojis. No Lucide.** Status badges pair icon + label (SealCheck / XCircle / Scales / SealQuestion).

## Buttons

- Primary: `rounded-full bg-primary` pill; flagship CTAs nest a trailing icon in its own circle (`bg-primary-foreground/15`) that translates on hover.
- Secondary: `border border-input bg-card` pill, hover `bg-secondary`.
- Quiet/destructive-quiet: text + `hover:bg-secondary` or `hover:bg-red-600/10`.
- All: `active:scale-[0.98]`, transitions `duration-300 ease-fluid`.

## Motion

- Easing token: `--ease-fluid: cubic-bezier(0.32, 0.72, 0, 1)`; utility `ease-fluid`. Never `linear`/`ease-in-out`.
- Scroll entry: `<Reveal>` component (IntersectionObserver, translate-y + opacity + blur, 700ms, staggered `delay` prop).
- Transform/opacity only. `backdrop-blur` only on fixed elements (nav, bottom nav, dialog overlays).

## Key components

- `public-layout` — floating pill nav (fixed, detached, blurred) + mobile bottom nav + footer + `FlashToast`.
- `post-card` — editorial list row: eyebrow meta → Fraunces headline → 2-line excerpt → stat row; bezelled thumb right.
- `featured-post` — page-1 lead story hero (photo, "Latest" tag, large headline).
- `verification-badge` — status pill with icon; `flash-toast` — bottom-centre success pill.
- Category filter = scrollable chip row; county = select.
- Brand mark: navy squircle + serif "C" + lone star top-right (`public/favicon.svg`, icon-192/512, apple-touch-icon). The star (Phosphor `Star` weight=fill) also appears in the auth mark and the feed masthead eyebrow — the only flag reference besides the blue.

## Copy rules

UK English. Sentence case everywhere (no Title Case headings). No exclamation marks, no "Oops", no em dashes. Buttons say what they do ("Post story", "Submit report").
