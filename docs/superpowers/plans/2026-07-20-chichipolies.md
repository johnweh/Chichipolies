# Chichipolies Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Chichipolies — Liberia's community news platform (post stories, community True/False verification, comments, reports, admin moderation, AI writing help) — as a standalone Laravel 12 + Inertia React app.

**Architecture:** Laravel 12 with the official React starter kit (Inertia v2, React 19, Tailwind 4, TypeScript, built-in session auth — this satisfies the spec's "session-based auth" requirement; the starter kit's auth controllers replace Fortify). Thin Inertia controllers; verification maths in a `VerificationStatus` enum; vote counter caches on `posts`; AI calls in `AiWritingService`.

**Tech Stack:** Laravel 12, PHP 8.2+, Inertia v2, React 19, Tailwind CSS 4, Pest 3, SQLite (dev/test), Claude API (Haiku).

## Global Constraints

- UK English in all code, copy, comments, column names.
- Repo: `/Users/gwbg/Products/chichipolies` (already git-initialised, contains `docs/`).
- Pre-production: edit original migrations in place, never add follow-up migrations.
- Every change lands with a Pest test; mock all external HTTP (never hit the Claude API in tests).
- Inertia page names are lowercase paths matching the starter kit (`feed/index` → `resources/js/pages/feed/index.tsx`).
- Brand: navy `#1e3a8a` primary, Inter font.
- Run `vendor/bin/pint --dirty` before each commit.
- Do NOT add a Co-Authored-By trailer to commits.

---

### Task 1: Scaffold Laravel 12 + React starter kit

**Files:**
- Create: entire Laravel app skeleton in `/Users/gwbg/Products/chichipolies`

**Interfaces:**
- Produces: working Laravel app with auth pages, `resources/js/pages/`, `resources/js/layouts/`, Pest configured, SQLite database.

- [ ] **Step 1: Scaffold into temp dir and merge into repo**

```bash
cd /Users/gwbg/Products
laravel new chichipolies-tmp --react --pest --npm --no-interaction
rsync -a --exclude .git chichipolies-tmp/ chichipolies/
rm -rf chichipolies-tmp
cd chichipolies
```

If the `laravel` installer is missing: `composer global require laravel/installer` first (or `composer create-project laravel/react-starter-kit chichipolies-tmp` then `composer require pestphp/pest --dev`).

- [ ] **Step 2: Verify baseline**

```bash
cd /Users/gwbg/Products/chichipolies
php artisan test --compact
npm run build
```

Expected: all starter tests PASS, Vite build succeeds.

- [ ] **Step 3: Set app identity**

Edit `.env`:
```
APP_NAME=Chichipolies
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: scaffold Laravel 12 React starter kit"
```

---

### Task 2: Domain enums

**Files:**
- Create: `app/Enums/Category.php`, `app/Enums/County.php`, `app/Enums/VerificationStatus.php`
- Test: `tests/Unit/VerificationStatusTest.php`

**Interfaces:**
- Produces: `Category::values(): array<string>`, `County::values(): array<string>`, `VerificationStatus::fromVotes(int $trueVotes, int $falseVotes): self` (cases: `Unverified`, `LikelyTrue`, `LikelyFalse`, `Disputed`; string-backed with display values `'Unverified'`, `'Likely True'`, `'Likely False'`, `'Disputed'`).

- [ ] **Step 1: Write failing tests**

`tests/Unit/VerificationStatusTest.php`:
```php
<?php

use App\Enums\Category;
use App\Enums\County;
use App\Enums\VerificationStatus;

it('is unverified under five total votes', function () {
    expect(VerificationStatus::fromVotes(4, 0))->toBe(VerificationStatus::Unverified)
        ->and(VerificationStatus::fromVotes(2, 2))->toBe(VerificationStatus::Unverified)
        ->and(VerificationStatus::fromVotes(0, 4))->toBe(VerificationStatus::Unverified);
});

it('is likely true at seventy percent or more', function () {
    expect(VerificationStatus::fromVotes(7, 3))->toBe(VerificationStatus::LikelyTrue)
        ->and(VerificationStatus::fromVotes(5, 0))->toBe(VerificationStatus::LikelyTrue);
});

it('is likely false at thirty percent or less', function () {
    expect(VerificationStatus::fromVotes(3, 7))->toBe(VerificationStatus::LikelyFalse)
        ->and(VerificationStatus::fromVotes(0, 5))->toBe(VerificationStatus::LikelyFalse);
});

it('is disputed between the thresholds', function () {
    expect(VerificationStatus::fromVotes(5, 5))->toBe(VerificationStatus::Disputed)
        ->and(VerificationStatus::fromVotes(69, 31))->toBe(VerificationStatus::Disputed);
});

it('exposes category and county value lists', function () {
    expect(Category::values())->toContain('Politics', 'Bad Road', 'Other')->toHaveCount(9)
        ->and(County::values())->toContain('Montserrado', 'River Gee')->toHaveCount(15);
});
```

- [ ] **Step 2: Run tests, verify failure**

Run: `php artisan test --compact --filter=VerificationStatusTest`
Expected: FAIL — classes not found.

- [ ] **Step 3: Implement enums**

`app/Enums/Category.php`:
```php
<?php

namespace App\Enums;

enum Category: string
{
    case Politics = 'Politics';
    case Crime = 'Crime';
    case Education = 'Education';
    case Entertainment = 'Entertainment';
    case Health = 'Health';
    case Lifestyle = 'Lifestyle';
    case Music = 'Music';
    case BadRoad = 'Bad Road';
    case Other = 'Other';

    /** @return array<string> */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
```

`app/Enums/County.php`:
```php
<?php

namespace App\Enums;

enum County: string
{
    case Bomi = 'Bomi';
    case Bong = 'Bong';
    case Gbarpolu = 'Gbarpolu';
    case GrandBassa = 'Grand Bassa';
    case GrandCapeMount = 'Grand Cape Mount';
    case GrandGedeh = 'Grand Gedeh';
    case GrandKru = 'Grand Kru';
    case Lofa = 'Lofa';
    case Margibi = 'Margibi';
    case Maryland = 'Maryland';
    case Montserrado = 'Montserrado';
    case Nimba = 'Nimba';
    case Rivercess = 'Rivercess';
    case RiverGee = 'River Gee';
    case Sinoe = 'Sinoe';

    /** @return array<string> */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
```

`app/Enums/VerificationStatus.php`:
```php
<?php

namespace App\Enums;

enum VerificationStatus: string
{
    case Unverified = 'Unverified';
    case LikelyTrue = 'Likely True';
    case LikelyFalse = 'Likely False';
    case Disputed = 'Disputed';

    public static function fromVotes(int $trueVotes, int $falseVotes): self
    {
        $total = $trueVotes + $falseVotes;

        if ($total < 5) {
            return self::Unverified;
        }

        $share = $trueVotes / $total;

        return match (true) {
            $share >= 0.7 => self::LikelyTrue,
            $share <= 0.3 => self::LikelyFalse,
            default => self::Disputed,
        };
    }
}
```

- [ ] **Step 4: Run tests, verify pass**

Run: `php artisan test --compact --filter=VerificationStatusTest`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
vendor/bin/pint --dirty && git add -A && git commit -m "feat: domain enums for category, county and verification status"
```

---

### Task 3: User admin flag, ban support, middleware

**Files:**
- Modify: `database/migrations/0001_01_01_000000_create_users_table.php` (add columns), `app/Models/User.php`, `database/factories/UserFactory.php`, `bootstrap/app.php`, `app/Http/Requests/Auth/LoginRequest.php`
- Create: `app/Http/Middleware/EnsureUserIsAdmin.php`, `app/Http/Middleware/EnsureUserNotBanned.php`
- Test: `tests/Feature/BanAndAdminTest.php`

**Interfaces:**
- Produces: `users.is_admin` (bool), `users.banned_at` (nullable timestamp); `UserFactory` states `admin()` and `banned()`; route middleware alias `admin`; global web middleware `EnsureUserNotBanned`.

- [ ] **Step 1: Write failing tests**

`tests/Feature/BanAndAdminTest.php`:
```php
<?php

use App\Models\User;

it('rejects login for a banned user', function () {
    $user = User::factory()->banned()->create(['password' => bcrypt('password')]);

    $this->post(route('login'), ['email' => $user->email, 'password' => 'password'])
        ->assertSessionHasErrors('email');

    $this->assertGuest();
});

it('logs out a user banned mid-session', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $user->update(['banned_at' => now()]);

    $this->get('/')->assertRedirect(route('login'));
    $this->assertGuest();
});

it('blocks non-admins from admin routes', function () {
    $this->actingAs(User::factory()->create());

    $this->get('/admin')->assertForbidden();
});

it('allows admins into admin routes', function () {
    $this->actingAs(User::factory()->admin()->create());

    $this->get('/admin')->assertOk();
});
```

(The `/admin` route lands in Task 10 — until then the last two tests target a temporary route added in Step 3.)

- [ ] **Step 2: Run tests, verify failure**

Run: `php artisan test --compact --filter=BanAndAdminTest`
Expected: FAIL — no `banned` factory state, no columns, no `/admin` route.

- [ ] **Step 3: Implement**

In the users migration, inside `Schema::create('users', ...)` after `password`:
```php
$table->boolean('is_admin')->default(false);
$table->timestamp('banned_at')->nullable();
```

`app/Models/User.php` — add to `$fillable`: `'is_admin', 'banned_at'`; add to `casts()`:
```php
'is_admin' => 'boolean',
'banned_at' => 'datetime',
```
Add methods and relation:
```php
public function isBanned(): bool
{
    return $this->banned_at !== null;
}

public function votes(): \Illuminate\Database\Eloquent\Relations\HasMany
{
    return $this->hasMany(Vote::class);
}
```
(`Vote` arrives in Task 5 — import lazily or add the relation in Task 5 if strictness bites; keep it here and create a stub-free forward reference is NOT allowed, so: add the `votes()` relation in **Task 5**, not here.)

`database/factories/UserFactory.php` — add states:
```php
public function admin(): static
{
    return $this->state(fn () => ['is_admin' => true]);
}

public function banned(): static
{
    return $this->state(fn () => ['banned_at' => now()]);
}
```

`app/Http/Middleware/EnsureUserIsAdmin.php`:
```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        abort_unless($request->user()?->is_admin, 403);

        return $next($request);
    }
}
```

`app/Http/Middleware/EnsureUserNotBanned.php`:
```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserNotBanned
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user()?->isBanned()) {
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->route('login');
        }

        return $next($request);
    }
}
```

`bootstrap/app.php` — inside `->withMiddleware(function (Middleware $middleware) { ... })`:
```php
$middleware->alias(['admin' => \App\Http\Middleware\EnsureUserIsAdmin::class]);
$middleware->web(append: [\App\Http\Middleware\EnsureUserNotBanned::class]);
```

`app/Http/Requests/Auth/LoginRequest.php` — in `authenticate()`, immediately after the successful `Auth::attempt` call:
```php
if ($this->user()->isBanned()) {
    Auth::guard('web')->logout();

    throw ValidationException::withMessages([
        'email' => __('This account has been banned.'),
    ]);
}
```
(If the starter kit's login lives elsewhere — e.g. a `LoginController` or Fortify action — put the same check at the point the session is created. Find it: `grep -rn "Auth::attempt\|attemptWhen" app/`.)

Temporary route in `routes/web.php` (replaced in Task 10):
```php
Route::get('/admin', fn () => response('ok'))->middleware(['auth', 'admin'])->name('admin.index');
```

- [ ] **Step 4: Run tests, verify pass**

Run: `php artisan test --compact --filter=BanAndAdminTest`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
vendor/bin/pint --dirty && git add -A && git commit -m "feat: admin flag, ban enforcement at login and mid-session"
```

---

### Task 4: Post model, migration, factory, verification accessor

**Files:**
- Create: `database/migrations/2026_07_20_000001_create_posts_table.php`, `app/Models/Post.php`, `database/factories/PostFactory.php`
- Test: `tests/Feature/PostModelTest.php`

**Interfaces:**
- Produces: `Post` model — fillable `user_id, title, body, category, county, photo_path, video_url`; casts `category` → `Category`, `county` → `County`; appended accessors `verification_status` (string) and `photo_url` (string|null); relations `user()`, `votes()`, `comments()`, `reports()`; counter columns `true_votes`, `false_votes` (default 0). `PostFactory` with sensible defaults.

- [ ] **Step 1: Write failing tests**

`tests/Feature/PostModelTest.php`:
```php
<?php

use App\Models\Post;

it('computes verification status from counters', function () {
    $post = Post::factory()->create(['true_votes' => 7, 'false_votes' => 3]);

    expect($post->verification_status)->toBe('Likely True');
});

it('is unverified with no votes', function () {
    expect(Post::factory()->create()->verification_status)->toBe('Unverified');
});

it('builds a public photo url from photo_path', function () {
    $post = Post::factory()->create(['photo_path' => 'posts/example.jpg']);

    expect($post->photo_url)->toContain('/storage/posts/example.jpg');

    expect(Post::factory()->create()->photo_url)->toBeNull();
});
```

- [ ] **Step 2: Run tests, verify failure**

Run: `php artisan test --compact --filter=PostModelTest`
Expected: FAIL — `Post` not found.

- [ ] **Step 3: Implement**

Migration `database/migrations/2026_07_20_000001_create_posts_table.php`:
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('body');
            $table->string('category');
            $table->string('county');
            $table->string('photo_path')->nullable();
            $table->string('video_url')->nullable();
            $table->unsignedInteger('true_votes')->default(0);
            $table->unsignedInteger('false_votes')->default(0);
            $table->timestamps();

            $table->index(['category', 'created_at']);
            $table->index(['county', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
```

`app/Models/Post.php`:
```php
<?php

namespace App\Models;

use App\Enums\Category;
use App\Enums\County;
use App\Enums\VerificationStatus;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'title', 'body', 'category', 'county',
        'photo_path', 'video_url', 'true_votes', 'false_votes',
    ];

    protected $appends = ['verification_status', 'photo_url'];

    protected function casts(): array
    {
        return [
            'category' => Category::class,
            'county' => County::class,
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function votes(): HasMany
    {
        return $this->hasMany(Vote::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function reports(): HasMany
    {
        return $this->hasMany(Report::class);
    }

    protected function verificationStatus(): Attribute
    {
        return Attribute::get(
            fn (): string => VerificationStatus::fromVotes($this->true_votes, $this->false_votes)->value
        );
    }

    protected function photoUrl(): Attribute
    {
        return Attribute::get(
            fn (): ?string => $this->photo_path ? Storage::disk('public')->url($this->photo_path) : null
        );
    }

    public function castVote(User $user, bool $isTrue): void
    {
        DB::transaction(function () use ($user, $isTrue) {
            $existing = $this->votes()->where('user_id', $user->id)->lockForUpdate()->first();

            if ($existing && $existing->is_true === $isTrue) {
                return;
            }

            if ($existing) {
                $existing->update(['is_true' => $isTrue]);
                $this->decrement($isTrue ? 'false_votes' : 'true_votes');
            } else {
                $this->votes()->create(['user_id' => $user->id, 'is_true' => $isTrue]);
            }

            $this->increment($isTrue ? 'true_votes' : 'false_votes');
        });
    }
}
```
(`Vote`, `Comment`, `Report` models land in Tasks 5–7; the relations reference them by class name and are exercised only from those tasks' tests onwards. `castVote` is tested in Task 5.)

`database/factories/PostFactory.php`:
```php
<?php

namespace Database\Factories;

use App\Enums\Category;
use App\Enums\County;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PostFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => fake()->sentence(6),
            'body' => fake()->paragraphs(3, true),
            'category' => fake()->randomElement(Category::values()),
            'county' => fake()->randomElement(County::values()),
            'photo_path' => null,
            'video_url' => null,
            'true_votes' => 0,
            'false_votes' => 0,
        ];
    }
}
```

Also add the `votes()` relation placeholder note: `User::votes()` is added in Task 5.

- [ ] **Step 4: Run tests, verify pass**

Run: `php artisan test --compact --filter=PostModelTest`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
vendor/bin/pint --dirty && git add -A && git commit -m "feat: post model with verification status and photo url accessors"
```

---

### Task 5: Votes

**Files:**
- Create: `database/migrations/2026_07_20_000002_create_votes_table.php`, `app/Models/Vote.php`, `app/Http/Controllers/VoteController.php`
- Modify: `app/Models/User.php` (add `votes()` relation), `routes/web.php`
- Test: `tests/Feature/VoteTest.php`

**Interfaces:**
- Consumes: `Post::castVote(User $user, bool $isTrue): void` (Task 4).
- Produces: `Vote` model (`user_id`, `post_id`, `is_true` bool cast); route `POST /post/{post}/vote` name `votes.store`, payload `{is_true: boolean}`; `User::votes(): HasMany`.

- [ ] **Step 1: Write failing tests**

`tests/Feature/VoteTest.php`:
```php
<?php

use App\Models\Post;
use App\Models\User;

it('casts a true vote and updates counters', function () {
    $user = User::factory()->create();
    $post = Post::factory()->create();

    $this->actingAs($user)
        ->post(route('votes.store', $post), ['is_true' => true])
        ->assertRedirect();

    expect($post->refresh())
        ->true_votes->toBe(1)
        ->false_votes->toBe(0)
        ->and($post->votes()->count())->toBe(1);
});

it('switches a vote without inflating counters', function () {
    $user = User::factory()->create();
    $post = Post::factory()->create();

    $this->actingAs($user);
    $this->post(route('votes.store', $post), ['is_true' => true]);
    $this->post(route('votes.store', $post), ['is_true' => false]);

    expect($post->refresh())
        ->true_votes->toBe(0)
        ->false_votes->toBe(1)
        ->and($post->votes()->count())->toBe(1);
});

it('repeating the same vote changes nothing', function () {
    $user = User::factory()->create();
    $post = Post::factory()->create();

    $this->actingAs($user);
    $this->post(route('votes.store', $post), ['is_true' => true]);
    $this->post(route('votes.store', $post), ['is_true' => true]);

    expect($post->refresh())->true_votes->toBe(1);
});

it('requires login to vote', function () {
    $post = Post::factory()->create();

    $this->post(route('votes.store', $post), ['is_true' => true])
        ->assertRedirect(route('login'));
});
```

- [ ] **Step 2: Run tests, verify failure**

Run: `php artisan test --compact --filter=VoteTest`
Expected: FAIL — route not defined.

- [ ] **Step 3: Implement**

Migration `database/migrations/2026_07_20_000002_create_votes_table.php`:
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('votes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('post_id')->constrained()->cascadeOnDelete();
            $table->boolean('is_true');
            $table->timestamps();

            $table->unique(['user_id', 'post_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('votes');
    }
};
```

`app/Models/Vote.php`:
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Vote extends Model
{
    protected $fillable = ['user_id', 'post_id', 'is_true'];

    protected function casts(): array
    {
        return ['is_true' => 'boolean'];
    }

    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
```

`app/Models/User.php` — add:
```php
public function votes(): \Illuminate\Database\Eloquent\Relations\HasMany
{
    return $this->hasMany(Vote::class);
}
```

`app/Http/Controllers/VoteController.php`:
```php
<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class VoteController extends Controller
{
    public function store(Request $request, Post $post): RedirectResponse
    {
        $validated = $request->validate(['is_true' => ['required', 'boolean']]);

        $post->castVote($request->user(), $validated['is_true']);

        return back();
    }
}
```

`routes/web.php`:
```php
Route::post('/post/{post}/vote', [\App\Http\Controllers\VoteController::class, 'store'])
    ->middleware('auth')->name('votes.store');
```

- [ ] **Step 4: Run tests, verify pass**

Run: `php artisan test --compact --filter=VoteTest`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
vendor/bin/pint --dirty && git add -A && git commit -m "feat: community true/false voting with counter caches"
```

---

### Task 6: Comments

**Files:**
- Create: `database/migrations/2026_07_20_000003_create_comments_table.php`, `app/Models/Comment.php`, `database/factories/CommentFactory.php`, `app/Http/Controllers/CommentController.php`
- Modify: `routes/web.php`
- Test: `tests/Feature/CommentTest.php`

**Interfaces:**
- Produces: `Comment` model (`post_id`, `user_id`, `body`; `user()` relation); route `POST /post/{post}/comments` name `comments.store`, payload `{body: string}`.

- [ ] **Step 1: Write failing tests**

`tests/Feature/CommentTest.php`:
```php
<?php

use App\Models\Post;
use App\Models\User;

it('stores a comment', function () {
    $post = Post::factory()->create();

    $this->actingAs(User::factory()->create())
        ->post(route('comments.store', $post), ['body' => 'Well done reporting this.'])
        ->assertRedirect();

    expect($post->comments()->count())->toBe(1);
});

it('rejects an empty comment', function () {
    $post = Post::factory()->create();

    $this->actingAs(User::factory()->create())
        ->post(route('comments.store', $post), ['body' => ''])
        ->assertSessionHasErrors('body');
});

it('requires login to comment', function () {
    $post = Post::factory()->create();

    $this->post(route('comments.store', $post), ['body' => 'hi'])
        ->assertRedirect(route('login'));
});
```

- [ ] **Step 2: Run tests, verify failure**

Run: `php artisan test --compact --filter=CommentTest`
Expected: FAIL — route not defined.

- [ ] **Step 3: Implement**

Migration `database/migrations/2026_07_20_000003_create_comments_table.php`:
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('post_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->text('body');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};
```

`app/Models/Comment.php`:
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = ['post_id', 'user_id', 'body'];

    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
```

`database/factories/CommentFactory.php`:
```php
<?php

namespace Database\Factories;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CommentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'post_id' => Post::factory(),
            'user_id' => User::factory(),
            'body' => fake()->sentence(12),
        ];
    }
}
```

`app/Http/Controllers/CommentController.php`:
```php
<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function store(Request $request, Post $post): RedirectResponse
    {
        $validated = $request->validate(['body' => ['required', 'string', 'max:2000']]);

        $post->comments()->create([
            'user_id' => $request->user()->id,
            'body' => $validated['body'],
        ]);

        return back();
    }
}
```

`routes/web.php`:
```php
Route::post('/post/{post}/comments', [\App\Http\Controllers\CommentController::class, 'store'])
    ->middleware('auth')->name('comments.store');
```

- [ ] **Step 4: Run tests, verify pass**

Run: `php artisan test --compact --filter=CommentTest`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
vendor/bin/pint --dirty && git add -A && git commit -m "feat: comments on posts"
```

---

### Task 7: Reports

**Files:**
- Create: `database/migrations/2026_07_20_000004_create_reports_table.php`, `app/Models/Report.php`, `database/factories/ReportFactory.php`, `app/Http/Controllers/ReportController.php`
- Modify: `routes/web.php`
- Test: `tests/Feature/ReportTest.php`

**Interfaces:**
- Produces: `Report` model (`post_id`, `user_id`, `reason`, `status` default `'pending'`, `resolved_by` nullable; relations `post()`, `user()`); route `POST /post/{post}/report` name `reports.store`, payload `{reason: 'Spam'|'Misinformation'|'Violence'|'Other'}`; factory state `pending()` (default) — later consumed by admin Task 10 (`dismiss` sets `status = 'dismissed'`, `resolved_by`).

- [ ] **Step 1: Write failing tests**

`tests/Feature/ReportTest.php`:
```php
<?php

use App\Models\Post;
use App\Models\User;

it('stores a report with a valid reason', function () {
    $post = Post::factory()->create();

    $this->actingAs(User::factory()->create())
        ->post(route('reports.store', $post), ['reason' => 'Misinformation'])
        ->assertRedirect();

    expect($post->reports()->first())
        ->reason->toBe('Misinformation')
        ->status->toBe('pending');
});

it('rejects an unknown reason', function () {
    $post = Post::factory()->create();

    $this->actingAs(User::factory()->create())
        ->post(route('reports.store', $post), ['reason' => 'Boring'])
        ->assertSessionHasErrors('reason');
});

it('requires login to report', function () {
    $post = Post::factory()->create();

    $this->post(route('reports.store', $post), ['reason' => 'Spam'])
        ->assertRedirect(route('login'));
});
```

- [ ] **Step 2: Run tests, verify failure**

Run: `php artisan test --compact --filter=ReportTest`
Expected: FAIL — route not defined.

- [ ] **Step 3: Implement**

Migration `database/migrations/2026_07_20_000004_create_reports_table.php`:
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('post_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('reason');
            $table->string('status')->default('pending');
            $table->foreignId('resolved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
```

`app/Models/Report.php`:
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Report extends Model
{
    use HasFactory;

    public const REASONS = ['Spam', 'Misinformation', 'Violence', 'Other'];

    protected $fillable = ['post_id', 'user_id', 'reason', 'status', 'resolved_by'];

    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
```

`database/factories/ReportFactory.php`:
```php
<?php

namespace Database\Factories;

use App\Models\Post;
use App\Models\Report;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReportFactory extends Factory
{
    public function definition(): array
    {
        return [
            'post_id' => Post::factory(),
            'user_id' => User::factory(),
            'reason' => fake()->randomElement(Report::REASONS),
            'status' => 'pending',
        ];
    }
}
```

`app/Http/Controllers/ReportController.php`:
```php
<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Report;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ReportController extends Controller
{
    public function store(Request $request, Post $post): RedirectResponse
    {
        $validated = $request->validate([
            'reason' => ['required', Rule::in(Report::REASONS)],
        ]);

        $post->reports()->create([
            'user_id' => $request->user()->id,
            'reason' => $validated['reason'],
        ]);

        return back()->with('success', 'Report submitted. Thank you.');
    }
}
```

`routes/web.php`:
```php
Route::post('/post/{post}/report', [\App\Http\Controllers\ReportController::class, 'store'])
    ->middleware('auth')->name('reports.store');
```

- [ ] **Step 4: Run tests, verify pass**

Run: `php artisan test --compact --filter=ReportTest`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
vendor/bin/pint --dirty && git add -A && git commit -m "feat: abuse reports on posts"
```

---

### Task 8: Feed — controller, filters, page

**Files:**
- Create: `app/Http/Controllers/FeedController.php`, `resources/js/pages/feed/index.tsx`, `resources/js/components/post-card.tsx`, `resources/js/components/verification-badge.tsx`, `resources/js/types/chichipolies.d.ts`
- Modify: `routes/web.php` (replace starter home route)
- Test: `tests/Feature/FeedTest.php`

**Interfaces:**
- Consumes: `Post` model + appends (Task 4), `Category::values()`, `County::values()` (Task 2).
- Produces: route `GET /` name `home` rendering Inertia page `feed/index` with props `posts` (paginator), `filters {search, category, county}`, `categories`, `counties`. TS types `PostSummary`, `CommentItem` in `chichipolies.d.ts`. Components `PostCard`, `VerificationBadge` reused by Task 9.

- [ ] **Step 1: Write failing tests**

`tests/Feature/FeedTest.php`:
```php
<?php

use App\Models\Post;
use Inertia\Testing\AssertableInertia as Assert;

it('renders the feed for guests', function () {
    Post::factory()->count(3)->create();

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('feed/index')
            ->has('posts.data', 3)
            ->has('categories', 9)
            ->has('counties', 15));
});

it('filters by category', function () {
    Post::factory()->create(['category' => 'Politics']);
    Post::factory()->create(['category' => 'Music']);

    $this->get(route('home', ['category' => 'Politics']))
        ->assertInertia(fn (Assert $page) => $page
            ->has('posts.data', 1)
            ->where('posts.data.0.category', 'Politics'));
});

it('filters by county', function () {
    Post::factory()->create(['county' => 'Nimba']);
    Post::factory()->create(['county' => 'Bong']);

    $this->get(route('home', ['county' => 'Nimba']))
        ->assertInertia(fn (Assert $page) => $page->has('posts.data', 1));
});

it('searches title and body', function () {
    Post::factory()->create(['title' => 'Bridge collapsed in Ganta']);
    Post::factory()->create(['title' => 'Football final', 'body' => 'The bridge crowd cheered']);
    Post::factory()->create(['title' => 'Market day', 'body' => 'Nothing relevant']);

    $this->get(route('home', ['search' => 'bridge']))
        ->assertInertia(fn (Assert $page) => $page->has('posts.data', 2));
});
```

- [ ] **Step 2: Run tests, verify failure**

Run: `php artisan test --compact --filter=FeedTest`
Expected: FAIL — `home` route renders the starter welcome page, not `feed/index`.

- [ ] **Step 3: Implement backend**

`app/Http/Controllers/FeedController.php`:
```php
<?php

namespace App\Http\Controllers;

use App\Enums\Category;
use App\Enums\County;
use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FeedController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();

        $posts = Post::query()
            ->with('user:id,name')
            ->withCount('comments')
            ->when($search !== '', fn ($query) => $query->where(fn ($q) => $q
                ->where('title', 'like', "%{$search}%")
                ->orWhere('body', 'like', "%{$search}%")))
            ->when($request->filled('category'), fn ($q) => $q->where('category', $request->string('category')))
            ->when($request->filled('county'), fn ($q) => $q->where('county', $request->string('county')))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('feed/index', [
            'posts' => $posts,
            'filters' => $request->only(['search', 'category', 'county']),
            'categories' => Category::values(),
            'counties' => County::values(),
        ]);
    }
}
```

`routes/web.php` — replace the starter `/` route:
```php
Route::get('/', [\App\Http\Controllers\FeedController::class, 'index'])->name('home');
```

- [ ] **Step 4: Run tests, verify pass**

Run: `php artisan test --compact --filter=FeedTest`
Expected: PASS (4 tests). (Inertia's test helper doesn't render React, so the page component file may not exist yet — but build it now anyway.)

- [ ] **Step 5: Implement frontend**

`resources/js/types/chichipolies.d.ts`:
```ts
export interface UserRef {
    id: number;
    name: string;
}

export interface PostSummary {
    id: number;
    title: string;
    body: string;
    category: string;
    county: string;
    photo_url: string | null;
    video_url: string | null;
    true_votes: number;
    false_votes: number;
    verification_status: 'Unverified' | 'Likely True' | 'Likely False' | 'Disputed';
    comments_count: number;
    created_at: string;
    user: UserRef;
}

export interface CommentItem {
    id: number;
    body: string;
    created_at: string;
    user: UserRef;
}

export interface Paginated<T> {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
    total: number;
}
```

`resources/js/components/verification-badge.tsx`:
```tsx
const styles: Record<string, string> = {
    'Unverified': 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
    'Likely True': 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    'Likely False': 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    'Disputed': 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
};

export default function VerificationBadge({ status }: { status: string }) {
    return (
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${styles[status] ?? styles.Unverified}`}>
            {status}
        </span>
    );
}
```

`resources/js/components/post-card.tsx`:
```tsx
import { Link } from '@inertiajs/react';
import VerificationBadge from '@/components/verification-badge';
import type { PostSummary } from '@/types/chichipolies';

export default function PostCard({ post }: { post: PostSummary }) {
    return (
        <Link
            href={`/post/${post.id}`}
            className="block rounded-xl border border-gray-200 bg-white p-4 transition hover:border-blue-900/40 dark:border-gray-700 dark:bg-gray-900"
        >
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span className="rounded bg-blue-900/10 px-1.5 py-0.5 font-medium text-blue-900 dark:bg-blue-400/10 dark:text-blue-300">
                    {post.category}
                </span>
                <span>{post.county}</span>
                <VerificationBadge status={post.verification_status} />
            </div>
            <h2 className="mt-2 font-semibold text-gray-900 dark:text-gray-100">{post.title}</h2>
            <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">{post.body}</p>
            {post.photo_url && (
                <img src={post.photo_url} alt="" className="mt-3 max-h-48 w-full rounded-lg object-cover" />
            )}
            <div className="mt-3 flex gap-4 text-xs text-gray-500 dark:text-gray-400">
                <span>✓ {post.true_votes}</span>
                <span>✗ {post.false_votes}</span>
                <span>💬 {post.comments_count}</span>
                <span className="ml-auto">by {post.user.name}</span>
            </div>
        </Link>
    );
}
```

`resources/js/pages/feed/index.tsx`:
```tsx
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import PostCard from '@/components/post-card';
import PublicLayout from '@/layouts/public-layout';
import type { Paginated, PostSummary } from '@/types/chichipolies';

interface Props {
    posts: Paginated<PostSummary>;
    filters: { search?: string; category?: string; county?: string };
    categories: string[];
    counties: string[];
}

export default function FeedIndex({ posts, filters, categories, counties }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');

    const applyFilters = (overrides: Record<string, string | undefined>) => {
        const params = { search, category: filters.category, county: filters.county, ...overrides };
        router.get('/', Object.fromEntries(Object.entries(params).filter(([, v]) => v)), {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <PublicLayout>
            <Head title="Community News" />
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    applyFilters({ search });
                }}
                className="flex flex-col gap-2 sm:flex-row"
            >
                <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search stories..."
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                />
                <select
                    value={filters.category ?? ''}
                    onChange={(e) => applyFilters({ category: e.target.value || undefined })}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                >
                    <option value="">Category</option>
                    {categories.map((c) => (
                        <option key={c}>{c}</option>
                    ))}
                </select>
                <select
                    value={filters.county ?? ''}
                    onChange={(e) => applyFilters({ county: e.target.value || undefined })}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                >
                    <option value="">County</option>
                    {counties.map((c) => (
                        <option key={c}>{c}</option>
                    ))}
                </select>
            </form>

            <div className="mt-4 flex flex-col gap-3">
                {posts.data.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}
                {posts.data.length === 0 && (
                    <p className="py-12 text-center text-sm text-gray-500">No stories yet. Be the first to post!</p>
                )}
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-1">
                {posts.links.map((link, i) =>
                    link.url ? (
                        <Link
                            key={i}
                            href={link.url}
                            className={`rounded px-3 py-1 text-sm ${link.active ? 'bg-blue-900 text-white' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ) : null,
                )}
            </div>
        </PublicLayout>
    );
}
```

`PublicLayout` is created in Task 12; until then create a minimal placeholder `resources/js/layouts/public-layout.tsx`:
```tsx
import type { PropsWithChildren } from 'react';

export default function PublicLayout({ children }: PropsWithChildren) {
    return <main className="mx-auto max-w-2xl px-4 py-6">{children}</main>;
}
```

- [ ] **Step 6: Verify build and commit**

```bash
npm run build
vendor/bin/pint --dirty && git add -A && git commit -m "feat: public feed with search, category and county filters"
```
Expected: Vite build succeeds, tests still pass.

---

### Task 9: Post detail + submit (photo upload, video URL, vote/comment/report UI)

**Files:**
- Create: `app/Http/Controllers/PostController.php`, `app/Http/Requests/StorePostRequest.php`, `resources/js/pages/posts/show.tsx`, `resources/js/pages/posts/create.tsx`, `resources/js/components/video-embed.tsx`, `resources/js/components/report-dialog.tsx`
- Modify: `routes/web.php`
- Test: `tests/Feature/PostTest.php`

**Interfaces:**
- Consumes: `PostCard`/`VerificationBadge` (Task 8), routes from Tasks 5–7.
- Produces: routes `GET /post/{post}` name `posts.show` (page `posts/show`, props `post`, `userVote: boolean|null`), `GET /submit` name `posts.create` (auth), `POST /submit` name `posts.store` (auth). Photos stored on `public` disk under `posts/`.

- [ ] **Step 1: Write failing tests**

`tests/Feature/PostTest.php`:
```php
<?php

use App\Models\Post;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

it('shows a post with comments to guests', function () {
    $post = Post::factory()->hasComments(2)->create();

    $this->get(route('posts.show', $post))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('posts/show')
            ->where('post.id', $post->id)
            ->has('post.comments', 2)
            ->where('userVote', null));
});

it('includes the current user vote', function () {
    $user = User::factory()->create();
    $post = Post::factory()->create();
    $post->castVote($user, true);

    $this->actingAs($user)
        ->get(route('posts.show', $post))
        ->assertInertia(fn (Assert $page) => $page->where('userVote', true));
});

it('stores a post with an uploaded photo', function () {
    Storage::fake('public');
    $user = User::factory()->create();

    $this->actingAs($user)->post(route('posts.store'), [
        'title' => 'New bridge opens in Gbarnga',
        'body' => 'The county authorities opened the new bridge today after months of work.',
        'category' => 'Community News',
        'county' => 'Bong',
        'photo' => UploadedFile::fake()->image('bridge.jpg'),
    ])->assertSessionHasErrors('category');

    $this->actingAs($user)->post(route('posts.store'), [
        'title' => 'New bridge opens in Gbarnga',
        'body' => 'The county authorities opened the new bridge today after months of work.',
        'category' => 'Other',
        'county' => 'Bong',
        'photo' => UploadedFile::fake()->image('bridge.jpg'),
    ])->assertRedirect();

    $post = Post::query()->latest('id')->first();
    expect($post->photo_path)->not->toBeNull();
    Storage::disk('public')->assertExists($post->photo_path);
});

it('accepts valid video urls and rejects others', function (string $url, bool $valid) {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('posts.store'), [
        'title' => 'Video story',
        'body' => 'Watch what happened at the rally in town yesterday afternoon.',
        'category' => 'Politics',
        'county' => 'Montserrado',
        'video_url' => $url,
    ]);

    if ($valid) {
        $response->assertSessionDoesntHaveErrors('video_url');
    } else {
        $response->assertSessionHasErrors('video_url');
    }
})->with([
    ['https://www.youtube.com/watch?v=abc123', true],
    ['https://youtu.be/abc123', true],
    ['https://www.tiktok.com/@user/video/123', true],
    ['https://fb.watch/xyz/', true],
    ['https://vimeo.com/123', false],
]);

it('requires login to submit', function () {
    $this->get(route('posts.create'))->assertRedirect(route('login'));
    $this->post(route('posts.store'), [])->assertRedirect(route('login'));
});
```

Add to `PostFactory`-consuming test support: `hasComments` uses the `comments()` relation + `CommentFactory` (Task 6) automatically via Laravel magic — no extra code.

- [ ] **Step 2: Run tests, verify failure**

Run: `php artisan test --compact --filter=PostTest`
Expected: FAIL — routes not defined.

- [ ] **Step 3: Implement backend**

`app/Http/Requests/StorePostRequest.php`:
```php
<?php

namespace App\Http\Requests;

use App\Enums\Category;
use App\Enums\County;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:150'],
            'body' => ['required', 'string', 'min:20', 'max:10000'],
            'category' => ['required', Rule::enum(Category::class)],
            'county' => ['required', Rule::enum(County::class)],
            'photo' => ['nullable', 'image', 'mimes:jpeg,png,webp', 'max:5120'],
            'video_url' => [
                'nullable', 'url', 'max:500',
                'regex:#^https?://(www\.)?(youtube\.com|youtu\.be|tiktok\.com|facebook\.com|fb\.watch)/#i',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'video_url.regex' => 'Video links must be from YouTube, TikTok or Facebook.',
        ];
    }
}
```

`app/Http/Controllers/PostController.php`:
```php
<?php

namespace App\Http\Controllers;

use App\Enums\Category;
use App\Enums\County;
use App\Http\Requests\StorePostRequest;
use App\Models\Post;
use App\Models\Report;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    public function show(Request $request, Post $post): Response
    {
        $post->load(['user:id,name', 'comments' => fn ($q) => $q->with('user:id,name')->latest()])
            ->loadCount('comments');

        return Inertia::render('posts/show', [
            'post' => $post,
            'userVote' => $request->user()
                ? $request->user()->votes()->where('post_id', $post->id)->value('is_true')
                : null,
            'reportReasons' => Report::REASONS,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('posts/create', [
            'categories' => Category::values(),
            'counties' => County::values(),
        ]);
    }

    public function store(StorePostRequest $request): RedirectResponse
    {
        $photoPath = $request->file('photo')?->store('posts', 'public');

        $post = $request->user()->posts()->create([
            ...$request->safe()->except('photo'),
            'photo_path' => $photoPath,
        ]);

        return redirect()->route('posts.show', $post)->with('success', 'Story posted!');
    }
}
```

`app/Models/User.php` — add:
```php
public function posts(): \Illuminate\Database\Eloquent\Relations\HasMany
{
    return $this->hasMany(Post::class);
}
```

`routes/web.php`:
```php
Route::get('/post/{post}', [\App\Http\Controllers\PostController::class, 'show'])->name('posts.show');
Route::get('/submit', [\App\Http\Controllers\PostController::class, 'create'])->middleware('auth')->name('posts.create');
Route::post('/submit', [\App\Http\Controllers\PostController::class, 'store'])->middleware('auth')->name('posts.store');
```

Note: `userVote` comes back from SQLite as `0/1` — cast in controller if the `where('userVote', true)` assertion fails: `->value('is_true')` on the `Vote` model query returns raw column; instead use `$request->user()->votes()->where('post_id', $post->id)->first()?->is_true` (model cast applies). Use the `first()?->is_true` form.

- [ ] **Step 4: Run tests, verify pass**

Run: `php artisan test --compact --filter=PostTest`
Expected: PASS (5 test functions, 9 assertions incl. dataset).

- [ ] **Step 5: Implement frontend**

`resources/js/components/video-embed.tsx`:
```tsx
export default function VideoEmbed({ url }: { url: string }) {
    const youtube = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{6,})/);

    if (youtube) {
        return (
            <div className="aspect-video overflow-hidden rounded-lg">
                <iframe
                    src={`https://www.youtube.com/embed/${youtube[1]}`}
                    className="h-full w-full"
                    allowFullScreen
                    title="Video"
                />
            </div>
        );
    }

    const label = url.includes('tiktok.com') ? 'TikTok Video' : url.includes('facebook.com') || url.includes('fb.watch') ? 'Facebook Video' : 'Video';

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-lg border border-gray-200 p-4 text-sm font-medium text-blue-900 hover:bg-gray-50 dark:border-gray-700 dark:text-blue-300 dark:hover:bg-gray-800"
        >
            ▶ Watch {label}
        </a>
    );
}
```

`resources/js/components/report-dialog.tsx`:
```tsx
import { useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function ReportDialog({ postId, reasons }: { postId: number; reasons: string[] }) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, reset } = useForm({ reason: '' });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/post/${postId}/report`, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setOpen(false);
            },
        });
    };

    return (
        <>
            <button onClick={() => setOpen(true)} className="text-xs text-gray-500 hover:text-red-600">
                ⚑ Report
            </button>
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setOpen(false)}>
                    <form
                        onSubmit={submit}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-sm rounded-xl bg-white p-5 dark:bg-gray-900"
                    >
                        <h3 className="font-semibold">Report abuse</h3>
                        <select
                            value={data.reason}
                            onChange={(e) => setData('reason', e.target.value)}
                            className="mt-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                            required
                        >
                            <option value="">Select a reason</option>
                            {reasons.map((r) => (
                                <option key={r}>{r}</option>
                            ))}
                        </select>
                        <div className="mt-4 flex justify-end gap-2">
                            <button type="button" onClick={() => setOpen(false)} className="rounded-lg px-3 py-1.5 text-sm">
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={processing || !data.reason}
                                className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
                            >
                                Report
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}
```

`resources/js/pages/posts/show.tsx`:
```tsx
import { Head, router, useForm, usePage } from '@inertiajs/react';
import ReportDialog from '@/components/report-dialog';
import VerificationBadge from '@/components/verification-badge';
import VideoEmbed from '@/components/video-embed';
import PublicLayout from '@/layouts/public-layout';
import type { CommentItem, PostSummary } from '@/types/chichipolies';

interface Props {
    post: PostSummary & { comments: CommentItem[] };
    userVote: boolean | null;
    reportReasons: string[];
}

export default function PostShow({ post, userVote, reportReasons }: Props) {
    const { auth } = usePage().props as { auth: { user: { id: number } | null } };
    const commentForm = useForm({ body: '' });

    const vote = (isTrue: boolean) => {
        if (!auth.user) return router.visit('/login');
        router.post(`/post/${post.id}/vote`, { is_true: isTrue }, { preserveScroll: true });
    };

    const share = async () => {
        const url = window.location.href;
        if (navigator.share) {
            await navigator.share({ title: post.title, url });
        } else {
            await navigator.clipboard.writeText(url);
            alert('Link copied!');
        }
    };

    const submitComment = (e: React.FormEvent) => {
        e.preventDefault();
        commentForm.post(`/post/${post.id}/comments`, {
            preserveScroll: true,
            onSuccess: () => commentForm.reset(),
        });
    };

    return (
        <PublicLayout>
            <Head title={post.title} />
            <article>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="rounded bg-blue-900/10 px-1.5 py-0.5 font-medium text-blue-900 dark:bg-blue-400/10 dark:text-blue-300">
                        {post.category}
                    </span>
                    <span>{post.county}</span>
                    <VerificationBadge status={post.verification_status} />
                </div>
                <h1 className="mt-2 text-2xl font-bold">{post.title}</h1>
                <p className="mt-1 text-xs text-gray-500">
                    by {post.user.name} · {new Date(post.created_at).toLocaleDateString('en-GB')}
                </p>
                {post.photo_url && <img src={post.photo_url} alt="" className="mt-4 w-full rounded-xl" />}
                {post.video_url && (
                    <div className="mt-4">
                        <VideoEmbed url={post.video_url} />
                    </div>
                )}
                <p className="mt-4 whitespace-pre-wrap text-gray-800 dark:text-gray-200">{post.body}</p>

                <div className="mt-6 flex items-center gap-3 border-y border-gray-200 py-3 dark:border-gray-700">
                    <span className="text-sm font-medium">Is this true?</span>
                    <button
                        onClick={() => vote(true)}
                        className={`rounded-lg border px-3 py-1.5 text-sm ${userVote === true ? 'border-green-600 bg-green-600 text-white' : 'border-gray-300 dark:border-gray-700'}`}
                    >
                        True ({post.true_votes})
                    </button>
                    <button
                        onClick={() => vote(false)}
                        className={`rounded-lg border px-3 py-1.5 text-sm ${userVote === false ? 'border-red-600 bg-red-600 text-white' : 'border-gray-300 dark:border-gray-700'}`}
                    >
                        False ({post.false_votes})
                    </button>
                    <button onClick={share} className="ml-auto text-sm text-gray-500 hover:text-blue-900">
                        ↗ Share
                    </button>
                    {auth.user && <ReportDialog postId={post.id} reasons={reportReasons} />}
                </div>

                <section className="mt-6">
                    <h2 className="font-semibold">Comments ({post.comments.length})</h2>
                    {auth.user ? (
                        <form onSubmit={submitComment} className="mt-3 flex gap-2">
                            <input
                                value={commentForm.data.body}
                                onChange={(e) => commentForm.setData('body', e.target.value)}
                                placeholder="Write a comment..."
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                            />
                            <button
                                type="submit"
                                disabled={commentForm.processing}
                                className="rounded-lg bg-blue-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                            >
                                Post
                            </button>
                        </form>
                    ) : (
                        <p className="mt-3 text-sm text-gray-500">Sign in to comment.</p>
                    )}
                    <ul className="mt-4 flex flex-col gap-3">
                        {post.comments.map((comment) => (
                            <li key={comment.id} className="rounded-lg bg-gray-50 p-3 text-sm dark:bg-gray-800">
                                <span className="font-medium">{comment.user.name}</span>
                                <p className="mt-1 text-gray-700 dark:text-gray-300">{comment.body}</p>
                            </li>
                        ))}
                    </ul>
                </section>
            </article>
        </PublicLayout>
    );
}
```

`resources/js/pages/posts/create.tsx`:
```tsx
import { Head, useForm } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';

interface Props {
    categories: string[];
    counties: string[];
}

export default function PostCreate({ categories, counties }: Props) {
    const { data, setData, post, processing, errors } = useForm<{
        title: string;
        body: string;
        category: string;
        county: string;
        photo: File | null;
        video_url: string;
    }>({ title: '', body: '', category: '', county: '', photo: null, video_url: '' });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/submit');
    };

    const field = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900';
    const error = (key: keyof typeof errors) => errors[key] && <p className="mt-1 text-xs text-red-600">{errors[key]}</p>;

    return (
        <PublicLayout>
            <Head title="Post a Story" />
            <h1 className="text-xl font-bold">Post a Story</h1>
            <form onSubmit={submit} className="mt-4 flex flex-col gap-4">
                <div>
                    <input
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        placeholder="Short, catchy title for your story"
                        className={field}
                    />
                    {error('title')}
                </div>
                <div>
                    <textarea
                        value={data.body}
                        onChange={(e) => setData('body', e.target.value)}
                        placeholder="What happened? Give as many details as you can. Who, what, when, where..."
                        rows={6}
                        className={field}
                    />
                    {error('body')}
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <select value={data.category} onChange={(e) => setData('category', e.target.value)} className={field}>
                            <option value="">What type of story is this?</option>
                            {categories.map((c) => (
                                <option key={c}>{c}</option>
                            ))}
                        </select>
                        {error('category')}
                    </div>
                    <div>
                        <select value={data.county} onChange={(e) => setData('county', e.target.value)} className={field}>
                            <option value="">Select a county</option>
                            {counties.map((c) => (
                                <option key={c}>{c}</option>
                            ))}
                        </select>
                        {error('county')}
                    </div>
                </div>
                <div>
                    <label className="text-sm font-medium">Photo (optional)</label>
                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(e) => setData('photo', e.target.files?.[0] ?? null)}
                        className="mt-1 block w-full text-sm"
                    />
                    {error('photo')}
                </div>
                <div>
                    <label className="text-sm font-medium">Video link (optional)</label>
                    <input
                        value={data.video_url}
                        onChange={(e) => setData('video_url', e.target.value)}
                        placeholder="https://youtube.com/watch?v=... or TikTok / Facebook link"
                        className={`${field} mt-1`}
                    />
                    {error('video_url')}
                </div>
                <button
                    type="submit"
                    disabled={processing}
                    className="rounded-lg bg-blue-900 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                >
                    {processing ? 'Posting…' : 'Post Story'}
                </button>
            </form>
        </PublicLayout>
    );
}
```

- [ ] **Step 6: Verify build and commit**

```bash
npm run build
php artisan test --compact --filter="PostTest|FeedTest"
vendor/bin/pint --dirty && git add -A && git commit -m "feat: post detail, story submission with photo upload and video links"
```

---

### Task 10: Admin panel

**Files:**
- Create: `app/Http/Controllers/Admin/DashboardController.php`, `app/Http/Controllers/Admin/PostController.php`, `app/Http/Controllers/Admin/UserController.php`, `app/Http/Controllers/Admin/ReportController.php`, `resources/js/pages/admin/index.tsx`
- Modify: `routes/web.php` (replace Task 3's temporary `/admin` route)
- Test: `tests/Feature/AdminTest.php`

**Interfaces:**
- Consumes: `admin` middleware alias (Task 3), models (Tasks 4–7).
- Produces: routes `GET /admin` name `admin.index` (page `admin/index`, props `posts`, `users`, `reports`); `DELETE /admin/posts/{post}` name `admin.posts.destroy`; `POST /admin/users/{user}/ban` name `admin.users.ban`; `POST /admin/users/{user}/unban` name `admin.users.unban`; `POST /admin/reports/{report}/dismiss` name `admin.reports.dismiss`. All under `['auth', 'admin']`.

- [ ] **Step 1: Write failing tests**

`tests/Feature/AdminTest.php`:
```php
<?php

use App\Models\Post;
use App\Models\Report;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->admin = User::factory()->admin()->create();
});

it('renders the dashboard with posts, users and pending reports', function () {
    Post::factory()->count(2)->create();
    Report::factory()->create();
    Report::factory()->create(['status' => 'dismissed']);

    $this->actingAs($this->admin)->get(route('admin.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/index')
            ->has('posts.data', 2)
            ->has('reports', 1));
});

it('deletes a post', function () {
    $post = Post::factory()->create();

    $this->actingAs($this->admin)
        ->delete(route('admin.posts.destroy', $post))
        ->assertRedirect();

    expect(Post::query()->find($post->id))->toBeNull();
});

it('bans and unbans a user', function () {
    $user = User::factory()->create();

    $this->actingAs($this->admin)->post(route('admin.users.ban', $user));
    expect($user->refresh()->isBanned())->toBeTrue();

    $this->actingAs($this->admin)->post(route('admin.users.unban', $user));
    expect($user->refresh()->isBanned())->toBeFalse();
});

it('refuses to ban an admin', function () {
    $other = User::factory()->admin()->create();

    $this->actingAs($this->admin)
        ->post(route('admin.users.ban', $other))
        ->assertForbidden();
});

it('dismisses a report', function () {
    $report = Report::factory()->create();

    $this->actingAs($this->admin)->post(route('admin.reports.dismiss', $report));

    expect($report->refresh())
        ->status->toBe('dismissed')
        ->resolved_by->toBe($this->admin->id);
});

it('blocks every admin route for non-admins', function (string $method, string $route) {
    $user = User::factory()->create();
    $post = Post::factory()->create();
    $report = Report::factory()->create();

    $target = match ($route) {
        'admin.index' => route('admin.index'),
        'admin.posts.destroy' => route('admin.posts.destroy', $post),
        'admin.users.ban' => route('admin.users.ban', User::factory()->create()),
        'admin.reports.dismiss' => route('admin.reports.dismiss', $report),
    };

    $this->actingAs($user)->{$method}($target)->assertForbidden();
})->with([
    ['get', 'admin.index'],
    ['delete', 'admin.posts.destroy'],
    ['post', 'admin.users.ban'],
    ['post', 'admin.reports.dismiss'],
]);
```

- [ ] **Step 2: Run tests, verify failure**

Run: `php artisan test --compact --filter=AdminTest`
Expected: FAIL — routes not defined (only the Task 3 stub exists).

- [ ] **Step 3: Implement backend**

`app/Http/Controllers/Admin/DashboardController.php`:
```php
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\Report;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/index', [
            'posts' => Post::query()->with('user:id,name')->withCount('comments')->latest()->paginate(20),
            'users' => User::query()->withCount('posts')->latest()->get(['id', 'name', 'email', 'is_admin', 'banned_at', 'created_at']),
            'reports' => Report::query()->where('status', 'pending')->with(['post:id,title', 'user:id,name'])->latest()->get(),
        ]);
    }
}
```

`app/Http/Controllers/Admin/PostController.php`:
```php
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\RedirectResponse;

class PostController extends Controller
{
    public function destroy(Post $post): RedirectResponse
    {
        $post->delete();

        return back()->with('success', 'Post deleted.');
    }
}
```

`app/Http/Controllers/Admin/UserController.php`:
```php
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;

class UserController extends Controller
{
    public function ban(User $user): RedirectResponse
    {
        abort_if($user->is_admin, 403);

        $user->update(['banned_at' => now()]);

        return back()->with('success', 'User banned.');
    }

    public function unban(User $user): RedirectResponse
    {
        $user->update(['banned_at' => null]);

        return back()->with('success', 'User unbanned.');
    }
}
```

`app/Http/Controllers/Admin/ReportController.php`:
```php
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function dismiss(Request $request, Report $report): RedirectResponse
    {
        $report->update([
            'status' => 'dismissed',
            'resolved_by' => $request->user()->id,
        ]);

        return back()->with('success', 'Report dismissed.');
    }
}
```

`routes/web.php` — replace the Task 3 stub:
```php
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('index');
    Route::delete('/posts/{post}', [\App\Http\Controllers\Admin\PostController::class, 'destroy'])->name('posts.destroy');
    Route::post('/users/{user}/ban', [\App\Http\Controllers\Admin\UserController::class, 'ban'])->name('users.ban');
    Route::post('/users/{user}/unban', [\App\Http\Controllers\Admin\UserController::class, 'unban'])->name('users.unban');
    Route::post('/reports/{report}/dismiss', [\App\Http\Controllers\Admin\ReportController::class, 'dismiss'])->name('reports.dismiss');
});
```

- [ ] **Step 4: Run tests, verify pass**

Run: `php artisan test --compact --filter="AdminTest|BanAndAdminTest"`
Expected: PASS (both suites; BanAndAdminTest's `/admin` assertions now hit the real dashboard).

- [ ] **Step 5: Implement frontend**

`resources/js/pages/admin/index.tsx`:
```tsx
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import PublicLayout from '@/layouts/public-layout';
import type { Paginated, PostSummary } from '@/types/chichipolies';

interface AdminUser {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
    banned_at: string | null;
    posts_count: number;
}

interface PendingReport {
    id: number;
    reason: string;
    created_at: string;
    post: { id: number; title: string };
    user: { id: number; name: string };
}

interface Props {
    posts: Paginated<PostSummary>;
    users: AdminUser[];
    reports: PendingReport[];
}

const tabs = ['Posts', 'Users', 'Reports'] as const;

export default function AdminIndex({ posts, users, reports }: Props) {
    const [tab, setTab] = useState<(typeof tabs)[number]>('Posts');
    const btn = 'rounded px-2 py-1 text-xs font-medium';

    return (
        <PublicLayout>
            <Head title="Admin" />
            <h1 className="text-xl font-bold">Admin</h1>
            <div className="mt-3 flex gap-1 border-b border-gray-200 dark:border-gray-700">
                {tabs.map((t) => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`px-3 py-2 text-sm ${tab === t ? 'border-b-2 border-blue-900 font-semibold text-blue-900 dark:text-blue-300' : 'text-gray-500'}`}
                    >
                        {t}
                        {t === 'Reports' && reports.length > 0 && (
                            <span className="ml-1 rounded-full bg-red-600 px-1.5 text-xs text-white">{reports.length}</span>
                        )}
                    </button>
                ))}
            </div>

            {tab === 'Posts' && (
                <ul className="mt-4 flex flex-col gap-2">
                    {posts.data.map((post) => (
                        <li key={post.id} className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 text-sm dark:border-gray-700">
                            <div className="min-w-0 flex-1">
                                <p className="truncate font-medium">{post.title}</p>
                                <p className="text-xs text-gray-500">
                                    {post.user.name} · {post.category} · {post.county} · {post.verification_status}
                                </p>
                            </div>
                            <button
                                onClick={() => confirm('Delete this post?') && router.delete(`/admin/posts/${post.id}`, { preserveScroll: true })}
                                className={`${btn} bg-red-600 text-white`}
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {tab === 'Users' && (
                <ul className="mt-4 flex flex-col gap-2">
                    {users.map((user) => (
                        <li key={user.id} className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 text-sm dark:border-gray-700">
                            <div className="min-w-0 flex-1">
                                <p className="font-medium">
                                    {user.name} {user.is_admin && <span className="text-xs text-blue-900 dark:text-blue-300">(admin)</span>}
                                    {user.banned_at && <span className="text-xs text-red-600"> (banned)</span>}
                                </p>
                                <p className="text-xs text-gray-500">{user.email} · {user.posts_count} posts</p>
                            </div>
                            {!user.is_admin &&
                                (user.banned_at ? (
                                    <button
                                        onClick={() => router.post(`/admin/users/${user.id}/unban`, {}, { preserveScroll: true })}
                                        className={`${btn} bg-gray-200 dark:bg-gray-700`}
                                    >
                                        Unban
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => router.post(`/admin/users/${user.id}/ban`, {}, { preserveScroll: true })}
                                        className={`${btn} bg-red-600 text-white`}
                                    >
                                        Ban
                                    </button>
                                ))}
                        </li>
                    ))}
                </ul>
            )}

            {tab === 'Reports' && (
                <ul className="mt-4 flex flex-col gap-2">
                    {reports.length === 0 && <p className="py-8 text-center text-sm text-gray-500">No pending reports.</p>}
                    {reports.map((report) => (
                        <li key={report.id} className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 text-sm dark:border-gray-700">
                            <div className="min-w-0 flex-1">
                                <p className="font-medium">{report.reason}</p>
                                <p className="truncate text-xs text-gray-500">
                                    Reported by {report.user.name} on “{report.post.title}”
                                </p>
                            </div>
                            <a href={`/post/${report.post.id}`} className={`${btn} bg-gray-200 dark:bg-gray-700`}>
                                View
                            </a>
                            <button
                                onClick={() => router.post(`/admin/reports/${report.id}/dismiss`, {}, { preserveScroll: true })}
                                className={`${btn} bg-blue-900 text-white`}
                            >
                                Dismiss
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </PublicLayout>
    );
}
```

- [ ] **Step 6: Verify build and commit**

```bash
npm run build
vendor/bin/pint --dirty && git add -A && git commit -m "feat: admin panel with posts, users and reports moderation"
```

---

### Task 11: AI writing helpers

**Files:**
- Create: `app/Services/AiWritingService.php`, `app/Http/Controllers/AiController.php`
- Modify: `config/services.php`, `.env.example`, `routes/web.php`, `resources/js/pages/posts/create.tsx` (Improve button), `resources/js/pages/posts/show.tsx` (Suggest button)
- Test: `tests/Feature/AiTest.php`

**Interfaces:**
- Consumes: `Post` model.
- Produces: `AiWritingService::improvePost(string $title, string $body): array{title: string, body: string}`, `AiWritingService::suggestComment(Post $post): string`; routes `POST /ai/improve-post` name `ai.improve-post` (payload `{title, body}`, JSON response `{title, body}`), `POST /ai/suggest-comment` name `ai.suggest-comment` (payload `{post_id}`, JSON response `{comment}`) — both `['auth', 'throttle:10,1']`.

- [ ] **Step 1: Write failing tests**

`tests/Feature/AiTest.php`:
```php
<?php

use App\Models\Post;
use App\Models\User;
use Illuminate\Support\Facades\Http;

it('improves a post via the claude api', function () {
    Http::fake([
        'api.anthropic.com/*' => Http::response([
            'content' => [['type' => 'text', 'text' => json_encode([
                'title' => 'Improved title',
                'body' => 'Improved body text.',
            ])]],
        ]),
    ]);

    $this->actingAs(User::factory()->create())
        ->postJson(route('ai.improve-post'), ['title' => 'my titl', 'body' => 'sum bodee text here ok'])
        ->assertOk()
        ->assertJson(['title' => 'Improved title', 'body' => 'Improved body text.']);

    Http::assertSent(fn ($request) => str_contains($request->url(), 'api.anthropic.com')
        && $request['model'] === 'claude-haiku-4-5-20251001');
});

it('suggests a comment for a post', function () {
    Http::fake([
        'api.anthropic.com/*' => Http::response([
            'content' => [['type' => 'text', 'text' => 'Thanks for reporting this important story.']],
        ]),
    ]);

    $post = Post::factory()->create();

    $this->actingAs(User::factory()->create())
        ->postJson(route('ai.suggest-comment'), ['post_id' => $post->id])
        ->assertOk()
        ->assertJson(['comment' => 'Thanks for reporting this important story.']);
});

it('returns 502 when the api fails', function () {
    Http::fake(['api.anthropic.com/*' => Http::response('overloaded', 529)]);

    $this->actingAs(User::factory()->create())
        ->postJson(route('ai.improve-post'), ['title' => 'a title', 'body' => 'a body of text here'])
        ->assertStatus(502);
});

it('requires login', function () {
    $this->postJson(route('ai.improve-post'), ['title' => 't', 'body' => 'b'])
        ->assertUnauthorized();
});
```

- [ ] **Step 2: Run tests, verify failure**

Run: `php artisan test --compact --filter=AiTest`
Expected: FAIL — routes not defined.

- [ ] **Step 3: Implement**

`config/services.php` — add:
```php
'anthropic' => [
    'key' => env('ANTHROPIC_API_KEY'),
],
```

`.env.example` — add:
```
ANTHROPIC_API_KEY=
```

`app/Services/AiWritingService.php`:
```php
<?php

namespace App\Services;

use App\Models\Post;
use Illuminate\Support\Facades\Http;

class AiWritingService
{
    private const MODEL = 'claude-haiku-4-5-20251001';

    /** @return array{title: string, body: string} */
    public function improvePost(string $title, string $body): array
    {
        $prompt = <<<PROMPT
        You edit community news stories for Chichipolies, Liberia's community news platform.
        Improve the clarity, grammar and structure of this draft story. Keep every fact exactly
        as written — never invent details. Keep the author's voice. Use UK English.

        Title: {$title}

        Story: {$body}

        Respond with ONLY a JSON object: {"title": "...", "body": "..."}
        PROMPT;

        $text = $this->complete($prompt);
        $decoded = json_decode($text, true);

        if (! is_array($decoded) || ! isset($decoded['title'], $decoded['body'])) {
            return ['title' => $title, 'body' => $body];
        }

        return ['title' => (string) $decoded['title'], 'body' => (string) $decoded['body']];
    }

    public function suggestComment(Post $post): string
    {
        $prompt = <<<PROMPT
        Suggest one short, constructive comment (under 40 words) a reader could post on this
        community news story from Liberia. Be supportive or ask a useful follow-up question.
        Use UK English. Respond with the comment text only.

        Title: {$post->title}

        Story: {$post->body}
        PROMPT;

        return trim($this->complete($prompt));
    }

    private function complete(string $prompt): string
    {
        $response = Http::withHeaders([
            'x-api-key' => config('services.anthropic.key'),
            'anthropic-version' => '2023-06-01',
        ])
            ->timeout(15)
            ->post('https://api.anthropic.com/v1/messages', [
                'model' => self::MODEL,
                'max_tokens' => 1024,
                'messages' => [['role' => 'user', 'content' => $prompt]],
            ])
            ->throw();

        return (string) $response->json('content.0.text');
    }
}
```

`app/Http/Controllers/AiController.php`:
```php
<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Services\AiWritingService;
use Illuminate\Http\Client\RequestException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AiController extends Controller
{
    public function __construct(private readonly AiWritingService $ai)
    {
    }

    public function improvePost(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:150'],
            'body' => ['required', 'string', 'max:10000'],
        ]);

        try {
            return response()->json($this->ai->improvePost($validated['title'], $validated['body']));
        } catch (RequestException) {
            return response()->json(['message' => 'AI helper is unavailable right now.'], 502);
        }
    }

    public function suggestComment(Request $request): JsonResponse
    {
        $validated = $request->validate(['post_id' => ['required', 'exists:posts,id']]);

        try {
            return response()->json(['comment' => $this->ai->suggestComment(Post::query()->findOrFail($validated['post_id']))]);
        } catch (RequestException) {
            return response()->json(['message' => 'AI helper is unavailable right now.'], 502);
        }
    }
}
```

`routes/web.php`:
```php
Route::middleware(['auth', 'throttle:10,1'])->prefix('ai')->name('ai.')->group(function () {
    Route::post('/improve-post', [\App\Http\Controllers\AiController::class, 'improvePost'])->name('improve-post');
    Route::post('/suggest-comment', [\App\Http\Controllers\AiController::class, 'suggestComment'])->name('suggest-comment');
});
```

- [ ] **Step 4: Run tests, verify pass**

Run: `php artisan test --compact --filter=AiTest`
Expected: PASS (4 tests).

- [ ] **Step 5: Wire UI buttons**

In `resources/js/pages/posts/create.tsx`, add inside the component:
```tsx
const [improving, setImproving] = useState(false);

const improve = async () => {
    setImproving(true);
    try {
        const res = await fetch('/ai/improve-post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] ?? ''),
            },
            body: JSON.stringify({ title: data.title, body: data.body }),
        });
        if (!res.ok) throw new Error();
        const improved = await res.json();
        setData((d) => ({ ...d, title: improved.title, body: improved.body }));
    } catch {
        alert('AI helper is unavailable right now.');
    } finally {
        setImproving(false);
    }
};
```
(add `import { useState } from 'react';`) and a button above the submit button:
```tsx
<button
    type="button"
    onClick={improve}
    disabled={improving || !data.title || !data.body}
    className="rounded-lg border border-blue-900 px-4 py-2 text-sm font-medium text-blue-900 disabled:opacity-50 dark:border-blue-300 dark:text-blue-300"
>
    {improving ? 'Improving…' : '✨ Improve my story'}
</button>
```

In `resources/js/pages/posts/show.tsx`, add the same-pattern `suggest` handler and a small "✨ Suggest" button beside the comment input that calls `/ai/suggest-comment` with `{ post_id: post.id }` and on success does `commentForm.setData('body', json.comment)`:
```tsx
const [suggesting, setSuggesting] = useState(false);

const suggest = async () => {
    setSuggesting(true);
    try {
        const res = await fetch('/ai/suggest-comment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] ?? ''),
            },
            body: JSON.stringify({ post_id: post.id }),
        });
        if (!res.ok) throw new Error();
        commentForm.setData('body', (await res.json()).comment);
    } catch {
        alert('AI helper is unavailable right now.');
    } finally {
        setSuggesting(false);
    }
};
```
(add `useState` import) with button inside the comment form:
```tsx
<button type="button" onClick={suggest} disabled={suggesting} className="rounded-lg border border-gray-300 px-3 text-sm dark:border-gray-700">
    ✨
</button>
```

- [ ] **Step 6: Verify build and commit**

```bash
npm run build
php artisan test --compact --filter=AiTest
vendor/bin/pint --dirty && git add -A && git commit -m "feat: AI story improvement and comment suggestions via Claude"
```

---

### Task 12: Layout, branding, About page, PWA, final sweep

**Files:**
- Create: `resources/js/pages/about.tsx`, `resources/js/components/bottom-nav.tsx`, `resources/js/hooks/use-theme.ts`, `public/manifest.json`
- Modify: `resources/js/layouts/public-layout.tsx` (full version), `resources/js/app.tsx` or `resources/css/app.css` (Inter font + primary colour), `resources/views/app.blade.php` (manifest + theme-color meta), `routes/web.php`
- Test: `tests/Feature/AboutTest.php`

**Interfaces:**
- Consumes: everything prior.
- Produces: route `GET /about` name `about` (page `about`); shared layout with top bar + mobile bottom nav + theme toggle.

- [ ] **Step 1: Write failing test**

`tests/Feature/AboutTest.php`:
```php
<?php

use Inertia\Testing\AssertableInertia as Assert;

it('renders the about page for guests', function () {
    $this->get(route('about'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('about'));
});
```

- [ ] **Step 2: Run test, verify failure**

Run: `php artisan test --compact --filter=AboutTest`
Expected: FAIL — route not defined.

- [ ] **Step 3: Implement**

`routes/web.php`:
```php
Route::get('/about', fn () => \Inertia\Inertia::render('about'))->name('about');
```

`resources/js/hooks/use-theme.ts`:
```ts
import { useCallback, useEffect, useState } from 'react';

export function useTheme() {
    const [dark, setDark] = useState(() =>
        typeof window !== 'undefined' &&
        (localStorage.theme === 'dark' ||
            (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)),
    );

    useEffect(() => {
        document.documentElement.classList.toggle('dark', dark);
        localStorage.theme = dark ? 'dark' : 'light';
    }, [dark]);

    const toggle = useCallback(() => setDark((d) => !d), []);

    return { dark, toggle };
}
```
(If the starter kit already ships a working appearance hook — check `resources/js/hooks/` — reuse it instead and delete this one.)

`resources/js/components/bottom-nav.tsx`:
```tsx
import { Link, usePage } from '@inertiajs/react';

export default function BottomNav() {
    const { auth, url } = usePage().props as unknown as { auth: { user: { is_admin?: boolean } | null } } & { url: string };
    const current = usePage().url;

    const items = [
        { href: '/', label: 'Feed', icon: '📰' },
        { href: '/submit', label: 'Post', icon: '✍️' },
        { href: '/about', label: 'About', icon: 'ℹ️' },
        ...(auth.user?.is_admin ? [{ href: '/admin', label: 'Admin', icon: '🛡️' }] : []),
    ];

    return (
        <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-gray-200 bg-white pb-[env(safe-area-inset-bottom)] sm:hidden dark:border-gray-700 dark:bg-gray-900">
            {items.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={`flex flex-1 flex-col items-center py-2 text-xs ${current === item.href ? 'font-semibold text-blue-900 dark:text-blue-300' : 'text-gray-500'}`}
                >
                    <span>{item.icon}</span>
                    {item.label}
                </Link>
            ))}
        </nav>
    );
}
```

`resources/js/layouts/public-layout.tsx` (replace placeholder):
```tsx
import { Link, usePage } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import BottomNav from '@/components/bottom-nav';
import { useTheme } from '@/hooks/use-theme';

export default function PublicLayout({ children }: PropsWithChildren) {
    const { auth } = usePage().props as unknown as { auth: { user: { name: string; is_admin?: boolean } | null } };
    const { dark, toggle } = useTheme();

    return (
        <div className="min-h-screen bg-gray-50 pb-16 sm:pb-0 dark:bg-gray-950">
            <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/90 backdrop-blur dark:border-gray-800 dark:bg-gray-900/90">
                <div className="mx-auto flex max-w-2xl items-center gap-4 px-4 py-3">
                    <Link href="/" className="text-lg font-extrabold text-blue-900 dark:text-blue-300">
                        Chichipolies
                    </Link>
                    <nav className="ml-auto hidden items-center gap-4 text-sm sm:flex">
                        <Link href="/" className="hover:text-blue-900">Feed</Link>
                        <Link href="/submit" className="hover:text-blue-900">Post a Story</Link>
                        <Link href="/about" className="hover:text-blue-900">About</Link>
                        {auth.user?.is_admin && <Link href="/admin" className="hover:text-blue-900">Admin</Link>}
                    </nav>
                    <button onClick={toggle} aria-label="Toggle theme" className="ml-auto text-lg sm:ml-0">
                        {dark ? '☀️' : '🌙'}
                    </button>
                    {auth.user ? (
                        <Link href="/logout" method="post" as="button" className="text-sm text-gray-500">
                            Sign out
                        </Link>
                    ) : (
                        <Link href="/login" className="rounded-lg bg-blue-900 px-3 py-1.5 text-sm font-medium text-white">
                            Sign In
                        </Link>
                    )}
                </div>
            </header>
            <main className="mx-auto max-w-2xl px-4 py-6">{children}</main>
            <BottomNav />
        </div>
    );
}
```
(Check the starter kit's logout route name — `grep -n "logout" routes/` — and match its method/URL.)

`resources/js/pages/about.tsx`:
```tsx
import { Head } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';

export default function About() {
    return (
        <PublicLayout>
            <Head title="About" />
            <h1 className="text-2xl font-bold">About Chichipolies</h1>
            <div className="prose prose-sm mt-4 dark:prose-invert">
                <p>
                    Chichipolies is Liberia's community-driven news platform. Citizens across all 15 counties
                    report what is happening around them — the community votes on whether each story is true,
                    keeping our news honest.
                </p>
                <h2>Community Guidelines</h2>
                <ul>
                    <li>Report what you saw, not what you heard.</li>
                    <li>Vote honestly — only mark a story true if you have good reason to believe it.</li>
                    <li>No hate speech, no incitement, no personal attacks.</li>
                    <li>Report abuse. Our moderators review every report.</li>
                </ul>
            </div>
        </PublicLayout>
    );
}
```

`public/manifest.json`:
```json
{
    "name": "Chichipolies",
    "short_name": "Chichipolies",
    "description": "Liberia's community-driven news platform.",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#ffffff",
    "theme_color": "#1e3a8a",
    "icons": []
}
```

`resources/views/app.blade.php` — in `<head>`:
```html
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#1e3a8a">
```

`resources/css/app.css` — Inter font + primary token. After the tailwind import add:
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

@theme {
    --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
    --color-primary: #1e3a8a;
}
```
(If the starter kit already defines `--font-sans` or a primary token in `app.css`, edit those values instead of duplicating.)

Also ensure the storage symlink instruction is in the README run steps: `php artisan storage:link` (required for photo URLs). Add a `database/seeders/DatabaseSeeder.php` admin user:
```php
User::factory()->admin()->create([
    'name' => 'Admin',
    'email' => 'admin@chichipolies.test',
]);
```

- [ ] **Step 4: Run full suite and verify**

```bash
php artisan storage:link
php artisan test --compact
npm run build
```
Expected: full suite PASS, build succeeds.

- [ ] **Step 5: Commit**

```bash
vendor/bin/pint --dirty && git add -A && git commit -m "feat: layout, branding, about page and PWA manifest"
```

---

## Self-Review Notes

- **Spec coverage:** feed+filters (T8), post detail/submit/photo/video (T9), votes+status maths (T2/T4/T5), comments (T6), reports (T7), admin (T10), AI (T11), auth+ban (T1/T3), layout/dark mode/PWA/about (T12). Share button in T9. All spec sections mapped.
- **Deviation from spec, accepted:** starter kit session auth instead of Fortify (equivalent capability; spec updated).
- **Type consistency check:** `castVote(User, bool)` defined T4, consumed T5. `Report::REASONS` defined T7, consumed T9 (`reportReasons` prop) and T10. `verification_status` string append used in TS types and badge component. Route names consistent across tasks.
