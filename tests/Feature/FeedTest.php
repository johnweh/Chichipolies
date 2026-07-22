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
