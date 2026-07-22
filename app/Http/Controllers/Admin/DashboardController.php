<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\Report;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function posts(): Response
    {
        return Inertia::render('admin/posts', [
            'posts' => Post::query()->with('user:id,name')->withCount('comments')->latest()->paginate(20),
        ]);
    }

    public function users(): Response
    {
        return Inertia::render('admin/users', [
            'users' => User::query()->withCount('posts')->latest()->get(['id', 'name', 'email', 'is_admin', 'banned_at', 'created_at']),
        ]);
    }

    public function reports(): Response
    {
        return Inertia::render('admin/reports', [
            'reports' => Report::query()->where('status', 'pending')->with(['post:id,title,true_votes,false_votes', 'user:id,name'])->latest()->get(),
        ]);
    }
}
