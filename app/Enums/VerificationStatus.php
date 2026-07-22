<?php

namespace App\Enums;

enum VerificationStatus: string
{
    case Unverified = 'Unverified';
    case LikelyTrue = 'Likely True';
    case LikelyFalse = 'Likely False';
    case Disputed = 'Disputed';

    public static function fromVotes(int $trueVotes, int $falseVotes): self
    {
        $total = $trueVotes + $falseVotes;

        if ($total < 5) {
            return self::Unverified;
        }

        $share = $trueVotes / $total;

        return match (true) {
            $share >= 0.7 => self::LikelyTrue,
            $share <= 0.3 => self::LikelyFalse,
            default => self::Disputed,
        };
    }
}
