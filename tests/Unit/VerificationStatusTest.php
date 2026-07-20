<?php

use App\Enums\Category;
use App\Enums\County;
use App\Enums\VerificationStatus;

it('is unverified under five total votes', function () {
    expect(VerificationStatus::fromVotes(4, 0))->toBe(VerificationStatus::Unverified)
        ->and(VerificationStatus::fromVotes(2, 2))->toBe(VerificationStatus::Unverified)
        ->and(VerificationStatus::fromVotes(0, 4))->toBe(VerificationStatus::Unverified);
});

it('is likely true at seventy percent or more', function () {
    expect(VerificationStatus::fromVotes(7, 3))->toBe(VerificationStatus::LikelyTrue)
        ->and(VerificationStatus::fromVotes(5, 0))->toBe(VerificationStatus::LikelyTrue);
});

it('is likely false at thirty percent or less', function () {
    expect(VerificationStatus::fromVotes(3, 7))->toBe(VerificationStatus::LikelyFalse)
        ->and(VerificationStatus::fromVotes(0, 5))->toBe(VerificationStatus::LikelyFalse);
});

it('is disputed between the thresholds', function () {
    expect(VerificationStatus::fromVotes(5, 5))->toBe(VerificationStatus::Disputed)
        ->and(VerificationStatus::fromVotes(69, 31))->toBe(VerificationStatus::Disputed);
});

it('exposes category and county value lists', function () {
    expect(Category::values())->toContain('Politics', 'Bad Road', 'Other')->toHaveCount(9)
        ->and(County::values())->toContain('Montserrado', 'River Gee')->toHaveCount(15);
});
