<?php

namespace Tests\Feature\Models;

use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskRelationsTest extends TestCase
{
    use RefreshDatabase;

    public function test_task_belongs_to_user(): void
    {
        $user = User::factory()->create();
        $task = Task::factory()->for($user)->create();

        $this->assertTrue($task->user()->exists());
        $this->assertEquals($user->id, $task->user->id);
    }

    public function test_task_can_be_created_with_factory(): void
    {
        $user = User::factory()->create();
        $task = Task::factory()->for($user)->create();

        $this->assertNotNull($task->id);
        $this->assertEquals($user->id, $task->user_id);
        $this->assertNotNull($task->title);
        $this->assertNotNull($task->description);
        $this->assertContains($task->status, Task::getStatuses());
    }

    public function test_task_factory_creates_different_status_states(): void
    {
        $user = User::factory()->create();

        $pendingTask = Task::factory()->pending()->for($user)->create();
        $inProgressTask = Task::factory()->inProgress()->for($user)->create();
        $doneTask = Task::factory()->done()->for($user)->create();

        $this->assertEquals('pending', $pendingTask->status);
        $this->assertEquals('in_progress', $inProgressTask->status);
        $this->assertEquals('done', $doneTask->status);
    }

    public function test_task_creating_with_valid_status(): void
    {
        $user = User::factory()->create();
        
        $task = Task::create([
            'user_id' => $user->id,
            'title' => 'Test Task',
            'description' => 'Test Description',
            'status' => 'pending'
        ]);

        $this->assertEquals('pending', $task->status);
        $this->assertEquals('Test Task', $task->title);
        $this->assertEquals('Test Description', $task->description);
        $this->assertEquals($user->id, $task->user_id);
    }
}
