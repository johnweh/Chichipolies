<?php

namespace App\Models;

use App\Enums\Category;
use App\Enums\County;
use App\Enums\VerificationStatus;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'title', 'body', 'category', 'county',
        'photo_path', 'video_url', 'true_votes', 'false_votes',
    ];

    protected $appends = ['verification_status', 'photo_url'];

    protected function casts(): array
    {
        return [
            'category' => Category::class,
            'county' => County::class,
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function votes(): HasMany
    {
        return $this->hasMany(Vote::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function reports(): HasMany
    {
        return $this->hasMany(Report::class);
    }

    protected function verificationStatus(): Attribute
    {
        return Attribute::get(
            fn (): string => VerificationStatus::fromVotes($this->true_votes, $this->false_votes)->value
        );
    }

    protected function photoUrl(): Attribute
    {
        return Attribute::get(
            fn (): ?string => $this->photo_path ? Storage::disk('public')->url($this->photo_path) : null
        );
    }

    public function castVote(User $user, bool $isTrue): void
    {
        DB::transaction(function () use ($user, $isTrue) {
            $existing = $this->votes()->where('user_id', $user->id)->lockForUpdate()->first();

            if ($existing && $existing->is_true === $isTrue) {
                return;
            }

            if ($existing) {
                $existing->update(['is_true' => $isTrue]);
                $this->decrement($isTrue ? 'false_votes' : 'true_votes');
            } else {
                $this->votes()->create(['user_id' => $user->id, 'is_true' => $isTrue]);
            }

            $this->increment($isTrue ? 'true_votes' : 'false_votes');
        });
    }
}
