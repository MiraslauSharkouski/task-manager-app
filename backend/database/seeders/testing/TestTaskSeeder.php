<?php

namespace Database\Seeders\Testing;

use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Seeder;

class TestTaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Получаем всех пользователей
        $users = User::all();

        foreach ($users as $user) {
            // Создаем задачи разных статусов для каждого пользователя
            Task::factory()->count(3)->for($user)->pending()->create();
            Task::factory()->count(2)->for($user)->inProgress()->create();
            Task::factory()->count(1)->for($user)->done()->create();
        }
    }
}
