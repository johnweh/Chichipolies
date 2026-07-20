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
