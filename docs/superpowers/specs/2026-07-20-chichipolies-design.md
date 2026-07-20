# Chichipolies — Design Spec

**Date:** 2026-07-20
**Status:** Approved by owner (brainstorming session)
**Reference:** https://chichipoly.manus.space/ (feature-mapped from production bundle)

## What

Liberia's community-driven news platform. Citizens post stories from any of the 15 counties; the community votes True/False to verify them; readers comment, share, and report abuse; admins moderate. AI helpers improve draft posts and suggest comments.

Full clone of the reference site's feature set in our stack, plus one deliberate upgrade: real photo uploads instead of URL-paste-only.

## Stack

- Standalone repo at `~/Products/chichipolies`
- Laravel 12, PHP 8.2+
- Inertia v2 + React 19, Tailwind CSS 4
- Auth: Laravel 12 React starter kit's built-in session auth (login/register/reset) — replaces the originally named Fortify; same session-based capability
- Testing: Pest 3
- Database: SQLite (local/test), MySQL 8 (prod)
- Routing: explicit routes in `routes/web.php`; Inertia page controllers under `App\Http\Controllers`
- UK English throughout code, copy, and column names

## Data model

### users
- `name`, `email` (unique), `password`
- `is_admin` boolean, default false
- `banned_at` nullable timestamp — banned users cannot log in; mid-session ban enforced by middleware

### posts
- `user_id` FK
- `title` (string), `body` (text)
- `category` — enum-backed string: Politics, Crime, Education, Entertainment, Health, Lifestyle, Music, Bad Road, Other
- `county` — enum-backed string: Bomi, Bong, Gbarpolu, Grand Bassa, Grand Cape Mount, Grand Gedeh, Grand Kru, Lofa, Margibi, Maryland, Montserrado, Nimba, Rivercess, River Gee, Sinoe
- `photo_path` nullable — uploaded image on public disk
- `video_url` nullable — YouTube / TikTok / Facebook URL, validated server-side
- `true_votes`, `false_votes` — integer counter caches, updated atomically on vote cast/switch

### votes
- `user_id` + `post_id` unique composite
- `is_true` boolean
- A user may switch their vote; switching decrements the old counter and increments the new one in a transaction

### comments
- `post_id`, `user_id`, `body` (text)

### reports
- `post_id`, `user_id` (reporter), `reason` (Spam, Misinformation, Violence, Other)
- `status`: pending | dismissed
- `resolved_by` nullable FK to users (admin who dismissed)

### Verification status (computed, not stored)

Derived from counter caches on read:

- total votes < 5 → **Unverified**
- true share ≥ 70% → **Likely True**
- true share ≤ 30% → **Likely False**
- otherwise → **Disputed**

Implemented as a `Post::verificationStatus()` accessor backed by a `VerificationStatus` PHP enum; single source of truth shared by feed, detail page, and admin.

## Backend

### Controllers (Inertia)

- `FeedController@index` — paginated feed; filters: free-text search (title+body), category, county. Query state in URL.
- `PostController@show` / `@create` / `@store`
- `CommentController@store`
- `VoteController@store` — cast or switch vote
- `ReportController@store`
- `Admin\PostController@index` / `@destroy`
- `Admin\UserController@index` / `@ban` / `@unban`
- `Admin\ReportController@index` / `@dismiss`
- `AiController@improvePost` / `@suggestComment`

Form Request classes for all validation. Thin controllers; verification maths and AI calls live in services.

### Authorisation

- Guests: read feed, post detail, about
- Authenticated: submit post, vote, comment, report
- `is_admin` gate + middleware for all `Admin\*` routes
- Banned: login rejected; `EnsureUserNotBanned` middleware logs out mid-session bans

### AI — `AiWritingService`

- Claude API, model `claude-haiku-4-5-20251001`, key via `config/services.php` ← `ANTHROPIC_API_KEY`
- Sync HTTP, 15s client timeout, graceful error toast on failure
- `improvePost(title, body)` → rewritten title + body (clearer, same facts, no invention)
- `suggestComment(post)` → short constructive comment draft
- Both endpoints `throttle:10,1`, auth required
- Tests mock the HTTP client — never hit the real API

### Media

- Photo: file upload, `image` mime jpeg/png/webp, max 5 MB, stored on `public` disk under `posts/`, served via storage symlink
- Video: URL field validated against YouTube (`youtube.com`, `youtu.be`), TikTok, Facebook (`facebook.com`, `fb.watch`) patterns; embed rendering client-side per provider

## Frontend

### Pages (`resources/js/Pages/`)

- `Feed/Index` — search bar, category + county select filters, post cards (title, excerpt, category badge, county, verification badge, vote counts, comment count, photo thumb), pagination
- `Posts/Show` — full story, photo/video embed, verification badge + True/False vote buttons with live counts, comments list + composer (with AI suggest button), share button (Web Share API + clipboard fallback), report dialog
- `Posts/Create` — submit form: title, body, category, county, photo upload, video URL, AI "Improve my story" button
- `About` — static: mission, community guidelines
- `Admin/Index` — tabs: Posts (list + delete), Users (list + ban/unban), Reports (pending queue + dismiss)
- Auth pages: login, register, forgot/reset password

### Design language

- Mobile-first; bottom nav on small screens (Feed / Post / About / Admin-if-admin), top nav on desktop
- Brand: navy `#1e3a8a` primary, Inter font
- Dark/light theme toggle, persisted in localStorage, `dark:` variants throughout
- PWA: manifest + icons + theme-colour meta (no service worker in v1)
- Verification badges colour-coded: grey Unverified, green Likely True, red Likely False, amber Disputed

## Testing (Pest)

- Feed: filters (search/category/county), pagination, props via `assertInertia`
- Posts: validation failures, photo upload (Storage::fake), video URL validation per provider, guest redirect
- Votes: cast, switch, counter integrity, status thresholds (boundary cases: 4 vs 5 votes, 69/70/71%)
- Comments + reports: create, guest blocked
- Admin: non-admin 403 on every admin route, delete post, ban/unban (banned login rejected + mid-session logout), dismiss report
- AI: mocked HTTP success + failure paths, throttle, guest blocked

## Out of scope (v1)

- Service worker / offline
- Social login
- Email notifications
- Post editing/deleting by author
- User profiles
