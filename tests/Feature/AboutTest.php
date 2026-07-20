<?php

use Inertia\Testing\AssertableInertia as Assert;

it('renders the about page for guests', function () {
    $this->get(route('about'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('about'));
});
