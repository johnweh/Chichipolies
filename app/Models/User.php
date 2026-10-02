<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_admin' => 'boolean',
            'is_owner' => 'boolean',
            'is_employee' => 'boolean',
            'banned_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::deleting(function (User $user) {
            $user->posts()->each(fn (Post $post) => $post->delete());
        });
    }

    public function canPostOfficial(): bool
    {
        return $this->is_owner || $this->is_employee;
    }

    public function isBanned(): bool
    {
        return $this->banned_at !== null;
    }

    public function votes(): HasMany
    {
        return $this->hasMany(Vote::class);
    }

    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }
}
