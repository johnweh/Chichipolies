<?php

namespace Database\Factories;

use App\Models\Post;
use App\Models\Report;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReportFactory extends Factory
{
    public function definition(): array
    {
        return [
            'post_id' => Post::factory(),
            'user_id' => User::factory(),
            'reason' => fake()->randomElement(Report::REASONS),
            'status' => 'pending',
        ];
    }
}
