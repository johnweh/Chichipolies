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
