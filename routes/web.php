<?php

use App\Http\Controllers\CommentController;
use App\Http\Controllers\FeedController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\VoteController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [FeedController::class, 'index'])->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::post('/post/{post}/vote', [VoteController::class, 'store'])
        ->name('votes.store');

    Route::post('/post/{post}/comments', [CommentController::class, 'store'])
        ->name('comments.store');

    Route::post('/post/{post}/report', [ReportController::class, 'store'])
        ->name('reports.store');
});

// Temporary — replaced by the real admin area in Task 10.
Route::get('/admin', fn () => response('ok'))->middleware(['auth', 'admin'])->name('admin.index');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
