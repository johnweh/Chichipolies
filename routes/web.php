<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\FeedController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\VoteController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [FeedController::class, 'index'])->name('home');

Route::get('/post/{post}', [PostController::class, 'show'])->name('posts.show');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('/submit', [PostController::class, 'create'])->name('posts.create');
    Route::post('/submit', [PostController::class, 'store'])->name('posts.store');

    Route::post('/post/{post}/vote', [VoteController::class, 'store'])
        ->name('votes.store');

    Route::post('/post/{post}/comments', [CommentController::class, 'store'])
        ->name('comments.store');

    Route::post('/post/{post}/report', [ReportController::class, 'store'])
        ->name('reports.store');
});

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('index');
    Route::delete('/posts/{post}', [App\Http\Controllers\Admin\PostController::class, 'destroy'])->name('posts.destroy');
    Route::post('/users/{user}/ban', [UserController::class, 'ban'])->name('users.ban');
    Route::post('/users/{user}/unban', [UserController::class, 'unban'])->name('users.unban');
    Route::post('/reports/{report}/dismiss', [App\Http\Controllers\Admin\ReportController::class, 'dismiss'])->name('reports.dismiss');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
