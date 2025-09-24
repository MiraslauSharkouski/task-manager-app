<?php

namespace Tests\Feature\Models;

use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class UserRelationsTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_has_many_tasks(): void
    {
        $user = User::factory()->create();
        $tasks = Task::factory()->count(5)->for($user)->create();

        $this->assertEquals(5, $user->tasks()->count());
        
        foreach ($user->tasks as $task) {
            $this->assertEquals($user->id, $task->user_id);
        }
    }

    public function test_user_tasks_relationship_returns_correct_model(): void
    {
        $user = User::factory()->create();
        $task = Task::factory()->for($user)->create();

        $this->assertInstanceOf(Task::class, $user->tasks()->first());
    }

    public function test_user_can_have_multiple_tasks(): void
    {
        $user = User::factory()->create();
        
        // Создаем задачи разных статусов
        Task::factory()->pending()->for($user)->create();
        Task::factory()->inProgress()->for($user)->create();
        Task::factory()->done()->for($user)->create();

        $this->assertEquals(3, $user->tasks()->count());
    }

    public function test_different_users_have_separate_tasks(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        
        $tasks1 = Task::factory()->count(3)->for($user1)->create();
        $tasks2 = Task::factory()->count(2)->for($user2)->create();

        $this->assertEquals(3, $user1->tasks()->count());
        $this->assertEquals(2, $user2->tasks()->count());
        
        foreach ($user1->tasks as $task) {
            $this->assertEquals($user1->id, $task->user_id);
        }
        
        foreach ($user2->tasks as $task) {
            $this->assertEquals($user2->id, $task->user_id);
        }
    }

    public function test_user_task_count_after_deletion(): void
    {
        $user = User::factory()->create();
        $tasks = Task::factory()->count(3)->for($user)->create();

        $this->assertEquals(3, $user->tasks()->count());

        // Удалим одну задачу
        $tasks->first()->delete();

        $this->assertEquals(2, $user->tasks()->count());
    }

    public function test_user_task_creation_and_retrieval(): void
    {
        $user = User::factory()->create();
        
        // Создаем задачи через связь
        $user->tasks()->create([
            'title' => 'Task 1',
            'description' => 'Description 1',
            'status' => 'pending'
        ]);
        
        $user->tasks()->create([
            'title' => 'Task 2',
            'description' => 'Description 2',
            'status' => 'in_progress'
        ]);

        $this->assertEquals(2, $user->tasks()->count());
        
        $task1 = $user->tasks()->where('title', 'Task 1')->first();
        $task2 = $user->tasks()->where('title', 'Task 2')->first();
        
        $this->assertEquals('Task 1', $task1->title);
        $this->assertEquals('pending', $task1->status);
        $this->assertEquals('Task 2', $task2->title);
        $this->assertEquals('in_progress', $task2->status);
    }

    public function test_user_password_is_hashed_on_creation(): void
    {
        $user = User::factory()->create([
            'password' => 'plain_password',
        ]);

        $this->assertTrue(Hash::check('plain_password', $user->password));
        $this->assertNotEquals('plain_password', $user->password);
    }

    public function test_user_can_be_created_with_factory(): void
    {
        $user = User::factory()->create();

        $this->assertNotNull($user->id);
        $this->assertNotNull($user->name);
        $this->assertNotNull($user->email);
        $this->assertStringContainsString('@', $user->email);
    }

    public function test_user_factory_creates_unverified_user(): void
    {
        $user = User::factory()->unverified()->create();

        $this->assertNull($user->email_verified_at);
    }
}
