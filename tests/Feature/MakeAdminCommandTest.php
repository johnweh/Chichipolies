<?php

use App\Models\User;

it('creates a verified admin owner on a fresh database', function () {
    $this->artisan('chichipolies:make-admin', ['email' => 'Owner@Example.com', '--owner' => true, '--name' => 'Owner'])
        ->expectsOutputToContain('Created owner@example.com.')
        ->expectsOutputToContain('Temporary password:')
        ->assertSuccessful();

    $user = User::query()->where('email', 'owner@example.com')->firstOrFail();

    expect($user->is_admin)->toBeTrue()
        ->and($user->is_owner)->toBeTrue()
        ->and($user->name)->toBe('Owner')
        ->and($user->email_verified_at)->not->toBeNull();
});

it('promotes an existing account without touching its password', function () {
    $user = User::factory()->create(['password' => bcrypt('secret-pass')]);

    $this->artisan('chichipolies:make-admin', ['email' => $user->email])
        ->expectsOutputToContain('is now an admin.')
        ->assertSuccessful();

    $user->refresh();

    expect($user->is_admin)->toBeTrue()
        ->and($user->is_owner)->toBeFalse()
        ->and(password_verify('secret-pass', $user->password))->toBeTrue();
});

it('rejects a malformed email', function () {
    $this->artisan('chichipolies:make-admin', ['email' => 'not-an-email'])->assertFailed();
});
