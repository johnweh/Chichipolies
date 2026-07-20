<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Services\AiWritingService;
use Illuminate\Http\Client\RequestException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AiController extends Controller
{
    public function __construct(private readonly AiWritingService $ai) {}

    public function improvePost(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:150'],
            'body' => ['required', 'string', 'max:10000'],
        ]);

        try {
            return response()->json($this->ai->improvePost($validated['title'], $validated['body']));
        } catch (RequestException) {
            return response()->json(['message' => 'AI helper is unavailable right now.'], 502);
        }
    }

    public function suggestComment(Request $request): JsonResponse
    {
        $validated = $request->validate(['post_id' => ['required', 'exists:posts,id']]);

        try {
            return response()->json(['comment' => $this->ai->suggestComment(Post::query()->findOrFail($validated['post_id']))]);
        } catch (RequestException) {
            return response()->json(['message' => 'AI helper is unavailable right now.'], 502);
        }
    }
}
