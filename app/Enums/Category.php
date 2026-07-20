<?php

namespace App\Enums;

enum Category: string
{
    case Politics = 'Politics';
    case Crime = 'Crime';
    case Education = 'Education';
    case Entertainment = 'Entertainment';
    case Health = 'Health';
    case Lifestyle = 'Lifestyle';
    case Music = 'Music';
    case BadRoad = 'Bad Road';
    case Other = 'Other';

    /** @return array<string> */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
