<?php

namespace App\Http\Controllers;

use App\Enums\Category;
use App\Enums\County;
use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FeedController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();

        $posts = Post::query()
            ->with('user:id,name')
            ->withCount('comments')
            ->when($search !== '', fn ($query) => $query->where(fn ($q) => $q
                ->where('title', 'like', "%{$search}%")
                ->orWhere('body', 'like', "%{$search}%")))
            ->when($request->filled('category'), fn ($q) => $q->where('category', $request->string('category')))
            ->when($request->filled('county'), fn ($q) => $q->where('county', $request->string('county')))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('feed/index', [
            'posts' => $posts,
            'filters' => $request->only(['search', 'category', 'county']),
            'categories' => Category::values(),
            'counties' => County::values(),
        ]);
    }
}
