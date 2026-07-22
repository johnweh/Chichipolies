<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class VoteController extends Controller
{
    public function store(Request $request, Post $post): RedirectResponse
    {
        $validated = $request->validate(['is_true' => ['required', 'boolean']]);

        $post->castVote($request->user(), $validated['is_true']);

        return back();
    }
}
