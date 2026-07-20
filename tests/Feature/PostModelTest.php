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
