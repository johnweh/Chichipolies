<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SearchController extends Controller
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
            ->when($search === '', fn ($query) => $query->whereRaw('0 = 1'))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('search/index', [
            'posts' => $posts,
            'filters' => ['search' => $search],
        ]);
    }
}
