<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Report;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ReportController extends Controller
{
    public function store(Request $request, Post $post): RedirectResponse
    {
        $validated = $request->validate([
            'reason' => ['required', Rule::in(Report::REASONS)],
        ]);

        $post->reports()->create([
            'user_id' => $request->user()->id,
            'reason' => $validated['reason'],
        ]);

        return back()->with('success', 'Report submitted. Thank you.');
    }
}
