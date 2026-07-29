<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function ban(User $user): RedirectResponse
    {
        abort_if($user->is_admin, 403);

        $user->forceFill(['banned_at' => now()])->save();

        return back()->with('success', 'User banned.');
    }

    public function unban(User $user): RedirectResponse
    {
        $user->forceFill(['banned_at' => null])->save();

        return back()->with('success', 'User unbanned.');
    }

    public function promote(User $user): RedirectResponse
    {
        abort_if($user->isBanned(), 403);

        $user->forceFill(['is_admin' => true])->save();

        return back()->with('success', "{$user->name} is now an admin.");
    }

    public function demote(Request $request, User $user): RedirectResponse
    {
        abort_unless($user->is_admin, 404);
        abort_if($user->id === $request->user()->id, 403);
        abort_if(User::query()->where('is_admin', true)->count() <= 1, 403);

        $user->forceFill(['is_admin' => false])->save();

        return back()->with('success', "{$user->name} is no longer an admin.");
    }
}
