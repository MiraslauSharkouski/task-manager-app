<?php

namespace Database\Seeders;

use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Seeder;

class TasksTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Создаем пользователей для сидов
        $users = User::factory(5)->create();

        // Для каждого пользователя создаем задачи
        foreach ($users as $user) {
            Task::factory()
                ->count(10)
                ->for($user)
                ->create();
        }

        // Дополнительно создаем по 3 задачи каждого статуса для демонстрации
        foreach ($users as $user) {
            Task::factory()->pending()->for($user)->create();
            Task::factory()->inProgress()->for($user)->create();
            Task::factory()->done()->for($user)->create();
        }
    }
}
