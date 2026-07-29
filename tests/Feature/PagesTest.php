<?php

use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use App\Models\Vote;
use Inertia\Testing\AssertableInertia as Assert;

it('renders the guidelines page for guests', function () {
    $this->get(route('guidelines'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('guidelines'));
});

it('renders the search page for guests', function () {
    $this->get(route('search'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('search/index'));
});

it('filters search results by title and body', function () {
    Post::factory()->create(['title' => 'Bridge collapsed in Ganta']);
    Post::factory()->create(['title' => 'Market day in Buchanan']);

    $this->get(route('search', ['search' => 'bridge']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('search/index')
            ->has('posts.data', 1)
            ->where('filters.search', 'bridge'));
});

it('requires login for saved stories', function () {
    $this->get(route('saved'))
        ->assertRedirect(route('login'));
});

it('shows saved stories the user voted true on', function () {
    $user = User::factory()->create();
    $saved = Post::factory()->create(['title' => 'Saved story']);
    $other = Post::factory()->create(['title' => 'Other story']);

    Vote::query()->create(['user_id' => $user->id, 'post_id' => $saved->id, 'is_true' => true]);
    Vote::query()->create(['user_id' => $user->id, 'post_id' => $other->id, 'is_true' => false]);

    $this->actingAs($user)
        ->get(route('saved'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('saved/index')
            ->has('posts.data', 1)
            ->where('posts.data.0.title', 'Saved story'));
});

it('requires login for notifications', function () {
    $this->get(route('notifications'))
        ->assertRedirect(route('login'));
});

it('shows comment and vote activity on the author notifications page', function () {
    $author = User::factory()->create();
    $reader = User::factory()->create(['name' => 'Reader One']);
    $post = Post::factory()->for($author)->create(['title' => 'My story']);

    Comment::factory()->for($post)->for($reader)->create(['body' => 'I was there too.']);
    Vote::query()->create(['user_id' => $reader->id, 'post_id' => $post->id, 'is_true' => true]);

    $this->actingAs($author)
        ->get(route('notifications'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('notifications/index')
            ->has('items', 2));
});

it('shares activity count for authenticated users', function () {
    $author = User::factory()->create();
    $reader = User::factory()->create();
    $post = Post::factory()->for($author)->create();

    Comment::factory()->for($post)->for($reader)->create();

    $this->actingAs($author)
        ->get(route('home'))
        ->assertInertia(fn (Assert $page) => $page->where('activityCount', 1));
});
