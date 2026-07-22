<?php

use App\Models\User;

it('rejects login for a banned user', function () {
    $user = User::factory()->banned()->create(['password' => bcrypt('password')]);

    $this->post(route('login'), ['email' => $user->email, 'password' => 'password'])
        ->assertSessionHasErrors('email');

    $this->assertGuest();
});

it('logs out a user banned mid-session', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $user->forceFill(['banned_at' => now()])->save();

    $this->get('/')->assertRedirect(route('login'));
    $this->assertGuest();
});

it('blocks non-admins from admin routes', function () {
    $this->actingAs(User::factory()->create());

    $this->get('/admin')->assertForbidden();
});

it('allows admins into admin routes', function () {
    $this->actingAs(User::factory()->admin()->create());

    $this->get('/admin')->assertOk();
});
