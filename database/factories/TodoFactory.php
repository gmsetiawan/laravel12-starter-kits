<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Todo>
 */
class TodoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'description' => fake()->sentence,
            'completed' => fake()->boolean,
            'priority' => fake()->randomElement(['low', 'medium', 'high']),
            'user_id' => User::inRandomOrder()->first()->id,
        ];
    }
}
