<?php

namespace App\Http\Controllers;

use App\Enums\Category;
use App\Enums\County;
use App\Http\Requests\StorePostRequest;
use App\Models\Post;
use App\Models\Report;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    public function show(Request $request, Post $post): Response
    {
        $post->load(['user:id,name', 'comments' => fn ($q) => $q->with('user:id,name')->latest()])
            ->loadCount('comments');

        return Inertia::render('posts/show', [
            'post' => $post,
            'userVote' => $request->user()
                ? $request->user()->votes()->where('post_id', $post->id)->first()?->is_true
                : null,
            'reportReasons' => Report::REASONS,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('posts/create', [
            'categories' => Category::values(),
            'counties' => County::values(),
        ]);
    }

    public function store(StorePostRequest $request): RedirectResponse
    {
        $photoPath = $request->file('photo')?->store('posts', 'public');

        $post = $request->user()->posts()->create([
            ...$request->safe()->except('photo'),
            'photo_path' => $photoPath,
        ]);

        return redirect()->route('posts.show', $post)->with('success', 'Story posted!');
    }
}
