<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\AiController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\FeedController;
use App\Http\Controllers\NotificationsController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SavedController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\VoteController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [FeedController::class, 'index'])->name('home');

Route::get('/about', fn () => Inertia::render('about'))->name('about');

Route::get('/guidelines', fn () => Inertia::render('guidelines'))->name('guidelines');

Route::get('/search', [SearchController::class, 'index'])->name('search');

Route::get('/privacy', fn () => Inertia::render('privacy'))->name('privacy');

Route::get('/terms', fn () => Inertia::render('terms'))->name('terms');

Route::get('/post/{post}', [PostController::class, 'show'])->name('posts.show');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', fn () => redirect()->route('home'))->name('dashboard');

    Route::get('/saved', [SavedController::class, 'index'])->name('saved');
    Route::get('/notifications', [NotificationsController::class, 'index'])->name('notifications');

    Route::get('/submit', [PostController::class, 'create'])->name('posts.create');
    Route::post('/submit', [PostController::class, 'store'])->name('posts.store');

    Route::post('/post/{post}/vote', [VoteController::class, 'store'])
        ->name('votes.store');

    Route::post('/post/{post}/comments', [CommentController::class, 'store'])
        ->name('comments.store');

    Route::post('/post/{post}/report', [ReportController::class, 'store'])
        ->name('reports.store');
});

Route::middleware(['auth', 'throttle:10,1'])->prefix('ai')->name('ai.')->group(function () {
    Route::post('/improve-post', [AiController::class, 'improvePost'])->name('improve-post');
    Route::post('/suggest-comment', [AiController::class, 'suggestComment'])->name('suggest-comment');
});

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', fn () => redirect()->route('admin.posts.index'))->name('index');
    Route::get('/posts', [DashboardController::class, 'posts'])->name('posts.index');
    Route::get('/users', [DashboardController::class, 'users'])->name('users.index');
    Route::get('/reports', [DashboardController::class, 'reports'])->name('reports.index');
    Route::delete('/posts/{post}', [App\Http\Controllers\Admin\PostController::class, 'destroy'])->name('posts.destroy');
    Route::post('/users/{user}/ban', [UserController::class, 'ban'])->name('users.ban');
    Route::post('/users/{user}/unban', [UserController::class, 'unban'])->name('users.unban');
    Route::post('/users/{user}/promote', [UserController::class, 'promote'])->name('users.promote');
    Route::post('/users/{user}/demote', [UserController::class, 'demote'])->name('users.demote');
    Route::post('/users/{user}/hire', [UserController::class, 'hire'])->name('users.hire');
    Route::post('/users/{user}/fire', [UserController::class, 'fire'])->name('users.fire');
    Route::post('/reports/{report}/dismiss', [App\Http\Controllers\Admin\ReportController::class, 'dismiss'])->name('reports.dismiss');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
