<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SavedController extends Controller
{
    public function index(Request $request): Response
    {
        $posts = Post::query()
            ->with('user:id,name')
            ->withCount('comments')
            ->whereHas('votes', fn ($query) => $query
                ->where('user_id', $request->user()->id)
                ->where('is_true', true))
            ->latest()
            ->paginate(15);

        return Inertia::render('saved/index', [
            'posts' => $posts,
        ]);
    }
}
