<?php

use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Client\ConnectionException;
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

it('returns 502 when the api connection fails', function () {
    Http::fake(fn () => throw new ConnectionException('timeout'));

    $this->actingAs(User::factory()->create())
        ->postJson(route('ai.improve-post'), ['title' => 'a title', 'body' => 'a body of text here'])
        ->assertStatus(502)
        ->assertJson(['message' => 'AI helper is unavailable right now.']);
});
