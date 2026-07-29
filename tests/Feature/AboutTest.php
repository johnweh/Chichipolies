<?php

use Inertia\Testing\AssertableInertia as Assert;

it('renders the about page for guests', function () {
    $this->get(route('about'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('about'));
});

it('renders the privacy page for guests', function () {
    $this->get(route('privacy'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('privacy'));
});

it('renders the terms page for guests', function () {
    $this->get(route('terms'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('terms'));
});

it('shares categories and counties on every page', function () {
    $this->get(route('home'))
        ->assertInertia(fn (Assert $page) => $page
            ->has('categories', 9)
            ->has('counties', 15));
});
