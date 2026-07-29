<?php

namespace App\Http\Controllers;

use App\Enums\Category;
use App\Enums\County;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FeedController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();
        $tab = $request->string('tab', 'stories')->toString();

        $posts = Post::query()
            ->with('user:id,name')
            ->withCount('comments')
            ->when($search !== '', fn ($query) => $query->where(fn ($q) => $q
                ->where('title', 'like', "%{$search}%")
                ->orWhere('body', 'like', "%{$search}%")))
            ->when($request->filled('category'), fn ($q) => $q->where('category', $request->string('category')))
            ->when($request->filled('county'), fn ($q) => $q->where('county', $request->string('county')))
            ->when($tab === 'active', fn ($q) => $q->has('comments'))
            ->when($tab === 'verified', fn ($q) => $q->where('true_votes', '>', 0)->whereColumn('true_votes', '>=', 'false_votes'))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        $topDiscussions = Post::query()
            ->where('created_at', '>=', now()->subWeek())
            ->withCount('comments')
            ->orderByDesc('comments_count')
            ->orderByDesc('created_at')
            ->limit(3)
            ->get(['id', 'title']);

        $topContributors = User::query()
            ->withCount('posts')
            ->whereHas('posts')
            ->orderByDesc('posts_count')
            ->limit(3)
            ->get(['id', 'name']);

        return Inertia::render('feed/index', [
            'posts' => $posts,
            'filters' => $request->only(['search', 'category', 'county', 'tab']),
            'categories' => Category::values(),
            'counties' => County::values(),
            'topDiscussions' => $topDiscussions,
            'topContributors' => $topContributors,
        ]);
    }
}
