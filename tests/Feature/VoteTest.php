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
