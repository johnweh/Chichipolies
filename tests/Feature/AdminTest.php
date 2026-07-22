<?php

use App\Models\Post;
use App\Models\Report;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->admin = User::factory()->admin()->create();
});

it('redirects the admin root to the stories page', function () {
    $this->actingAs($this->admin)->get(route('admin.index'))
        ->assertRedirect(route('admin.posts.index'));
});

it('renders the stories page with posts and the pending report count', function () {
    $posts = Post::factory()->count(2)->create();
    Report::factory()->create(['post_id' => $posts->first()->id]);
    Report::factory()->create(['post_id' => $posts->last()->id, 'status' => 'dismissed']);

    $this->actingAs($this->admin)->get(route('admin.posts.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/posts')
            ->has('posts.data', 2)
            ->where('pendingReports', 1));
});

it('renders the members page', function () {
    User::factory()->count(2)->create();

    $this->actingAs($this->admin)->get(route('admin.users.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/users')
            ->has('users', 3));
});

it('renders the reports page with pending reports only', function () {
    $posts = Post::factory()->count(2)->create();
    Report::factory()->create(['post_id' => $posts->first()->id]);
    Report::factory()->create(['post_id' => $posts->last()->id, 'status' => 'dismissed']);

    $this->actingAs($this->admin)->get(route('admin.reports.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/reports')
            ->has('reports', 1)
            ->where('pendingReports', 1));
});

it('deletes a post', function () {
    $post = Post::factory()->create();

    $this->actingAs($this->admin)
        ->delete(route('admin.posts.destroy', $post))
        ->assertRedirect();

    expect(Post::query()->find($post->id))->toBeNull();
});

it('bans and unbans a user', function () {
    $user = User::factory()->create();

    $this->actingAs($this->admin)->post(route('admin.users.ban', $user));
    expect($user->refresh()->isBanned())->toBeTrue();

    $this->actingAs($this->admin)->post(route('admin.users.unban', $user));
    expect($user->refresh()->isBanned())->toBeFalse();
});

it('refuses to ban an admin', function () {
    $other = User::factory()->admin()->create();

    $this->actingAs($this->admin)
        ->post(route('admin.users.ban', $other))
        ->assertForbidden();
});

it('dismisses a report', function () {
    $report = Report::factory()->create();

    $this->actingAs($this->admin)->post(route('admin.reports.dismiss', $report));

    expect($report->refresh())
        ->status->toBe('dismissed')
        ->resolved_by->toBe($this->admin->id);
});

it('blocks every admin route for non-admins', function (string $method, string $route) {
    $user = User::factory()->create();
    $post = Post::factory()->create();
    $report = Report::factory()->create();

    $target = match ($route) {
        'admin.index' => route('admin.index'),
        'admin.posts.index' => route('admin.posts.index'),
        'admin.users.index' => route('admin.users.index'),
        'admin.reports.index' => route('admin.reports.index'),
        'admin.posts.destroy' => route('admin.posts.destroy', $post),
        'admin.users.ban' => route('admin.users.ban', User::factory()->create()),
        'admin.reports.dismiss' => route('admin.reports.dismiss', $report),
    };

    $this->actingAs($user)->{$method}($target)->assertForbidden();
})->with([
    ['get', 'admin.index'],
    ['get', 'admin.posts.index'],
    ['get', 'admin.users.index'],
    ['get', 'admin.reports.index'],
    ['delete', 'admin.posts.destroy'],
    ['post', 'admin.users.ban'],
    ['post', 'admin.reports.dismiss'],
]);
