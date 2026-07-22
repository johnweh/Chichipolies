<?php

namespace Database\Factories;

use App\Enums\Category;
use App\Enums\County;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PostFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => fake()->sentence(6),
            'body' => fake()->paragraphs(3, true),
            'category' => fake()->randomElement(Category::values()),
            'county' => fake()->randomElement(County::values()),
            'photo_path' => null,
            'video_url' => null,
            'true_votes' => 0,
            'false_votes' => 0,
        ];
    }
}
