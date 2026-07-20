<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\RedirectResponse;

class PostController extends Controller
{
    public function destroy(Post $post): RedirectResponse
    {
        $post->delete();

        return back()->with('success', 'Post deleted.');
    }
}
