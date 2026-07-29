<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Vote;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotificationsController extends Controller
{
    public function index(Request $request): Response
    {
        $userId = $request->user()->id;

        $commentActivity = Comment::query()
            ->where('user_id', '!=', $userId)
            ->whereHas('post', fn ($query) => $query->where('user_id', $userId))
            ->with(['post:id,title', 'user:id,name'])
            ->latest()
            ->limit(25)
            ->get()
            ->map(fn (Comment $comment) => [
                'id' => "comment-{$comment->id}",
                'type' => 'comment',
                'post' => $comment->post->only(['id', 'title']),
                'actor' => $comment->user->only(['id', 'name']),
                'body' => $comment->body,
                'created_at' => $comment->created_at,
            ]);

        $voteActivity = Vote::query()
            ->where('user_id', '!=', $userId)
            ->whereHas('post', fn ($query) => $query->where('user_id', $userId))
            ->with(['post:id,title', 'user:id,name'])
            ->latest()
            ->limit(25)
            ->get()
            ->map(fn (Vote $vote) => [
                'id' => "vote-{$vote->id}",
                'type' => 'vote',
                'post' => $vote->post->only(['id', 'title']),
                'actor' => $vote->user->only(['id', 'name']),
                'is_true' => $vote->is_true,
                'created_at' => $vote->created_at,
            ]);

        $items = $commentActivity
            ->concat($voteActivity)
            ->sortByDesc('created_at')
            ->values()
            ->take(30)
            ->all();

        return Inertia::render('notifications/index', [
            'items' => $items,
        ]);
    }
}
