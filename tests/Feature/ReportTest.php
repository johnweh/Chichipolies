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
