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
    public function index(): Response
    {
        return Inertia::render('admin/index', [
            'posts' => Post::query()->with('user:id,name')->withCount('comments')->latest()->paginate(20),
            'users' => User::query()->withCount('posts')->latest()->get(['id', 'name', 'email', 'is_admin', 'banned_at', 'created_at']),
            'reports' => Report::query()->where('status', 'pending')->with(['post:id,title,true_votes,false_votes', 'user:id,name'])->latest()->get(),
        ]);
    }
}
