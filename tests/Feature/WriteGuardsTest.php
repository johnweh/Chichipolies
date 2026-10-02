<?php

use App\Models\Post;
use App\Models\User;

it('sends unverified users to the verification notice before they can write', function () {
    $user = User::factory()->unverified()->create();
    $post = Post::factory()->create();

    $this->actingAs($user)->post(route('votes.store', $post), ['value' => true])
        ->assertRedirect(route('verification.notice'));
    $this->actingAs($user)->post(route('comments.store', $post), ['body' => 'Hello'])
        ->assertRedirect(route('verification.notice'));
    $this->actingAs($user)->post(route('reports.store', $post), ['reason' => 'Spam'])
        ->assertRedirect(route('verification.notice'));
    $this->actingAs($user)->post(route('posts.store'), [])
        ->assertRedirect(route('verification.notice'));

    expect($post->comments()->count())->toBe(0)
        ->and($post->reports()->count())->toBe(0);
});

it('still lets unverified users read the feed and a story', function () {
    $user = User::factory()->unverified()->create();
    $post = Post::factory()->create();

    $this->actingAs($user)->get('/')->assertOk();
    $this->actingAs($user)->get(route('posts.show', $post))->assertOk();
});

it('rate limits reports per user', function () {
    $user = User::factory()->create();
    $posts = Post::factory()->count(21)->create();

    foreach ($posts->take(20) as $post) {
        $this->actingAs($user)
            ->post(route('reports.store', $post), ['reason' => 'Spam'])
            ->assertRedirect();
    }

    $this->actingAs($user)
        ->post(route('reports.store', $posts->last()), ['reason' => 'Spam'])
        ->assertStatus(429);
});

it('rate limits registration per address', function () {
    for ($i = 1; $i <= 5; $i++) {
        $this->post(route('register'), [
            'name' => "Person {$i}",
            'email' => "person{$i}@example.com",
            'password' => 'password-123',
            'password_confirmation' => 'password-123',
        ])->assertRedirect();

        auth()->logout();
    }

    $this->post(route('register'), [
        'name' => 'Person 6',
        'email' => 'person6@example.com',
        'password' => 'password-123',
        'password_confirmation' => 'password-123',
    ])->assertStatus(429);
});
