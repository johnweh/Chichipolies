<?php

namespace App\Enums;

enum County: string
{
    case Bomi = 'Bomi';
    case Bong = 'Bong';
    case Gbarpolu = 'Gbarpolu';
    case GrandBassa = 'Grand Bassa';
    case GrandCapeMount = 'Grand Cape Mount';
    case GrandGedeh = 'Grand Gedeh';
    case GrandKru = 'Grand Kru';
    case Lofa = 'Lofa';
    case Margibi = 'Margibi';
    case Maryland = 'Maryland';
    case Montserrado = 'Montserrado';
    case Nimba = 'Nimba';
    case Rivercess = 'Rivercess';
    case RiverGee = 'River Gee';
    case Sinoe = 'Sinoe';

    /** @return array<string> */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
