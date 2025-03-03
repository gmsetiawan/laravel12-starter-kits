<?php

namespace Database\Seeders;

use App\Models\Todo;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory(10)->create();

        User::factory()->create([
            'name' => 'Developer',
            'email' => 'developer@localhost.com',
        ]);

        User::all()->each(function (User $user) {
            Todo::factory(10)->create([
                'user_id' => $user->id,
            ]);
        });
    }
}
