<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;

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
}
