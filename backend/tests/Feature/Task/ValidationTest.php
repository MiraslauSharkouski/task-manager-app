<?php

namespace Tests\Feature\Task;

use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ValidationTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected string $token;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = User::factory()->create();
        $this->token = $this->user->createToken('test-token')->plainTextToken;
    }

    public function test_task_creation_requires_valid_data(): void
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson('/api/tasks', []);

        $response->assertStatus(422)
            ->assertJsonStructure([
                'message',
                'errors' => [
                    'title',
                ]
            ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson('/api/tasks', [
            'title' => '',
            'description' => 'Too long ' . str_repeat('a', 1000),
            'status' => 'invalid_status',
        ]);

        $response->assertStatus(422);
    }

    public function test_task_creation_with_valid_data(): void
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson('/api/tasks', [
            'title' => 'Valid Task Title',
            'description' => 'Valid task description',
            'status' => 'pending',
        ]);

        $response->assertStatus(201);
    }

    public function test_task_update_with_valid_data(): void
    {
        $task = Task::factory()->for($this->user)->create();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->putJson('/api/tasks/' . $task->id, [
            'title' => 'Updated Task Title',
            'description' => 'Updated task description',
            'status' => 'in_progress',
        ]);

        $response->assertStatus(200);
    }

    public function test_task_update_with_invalid_data(): void
    {
        $task = Task::factory()->for($this->user)->create();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->putJson('/api/tasks/' . $task->id, [
            'title' => '',
            'status' => 'invalid_status',
        ]);

        $response->assertStatus(422);
    }

    public function test_task_title_cannot_be_too_long(): void
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson('/api/tasks', [
            'title' => str_repeat('a', 256), // More than 255 characters
            'description' => 'Valid description',
            'status' => 'pending',
        ]);

        $response->assertStatus(422);
    }

    public function test_task_status_must_be_valid(): void
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson('/api/tasks', [
            'title' => 'Test Task',
            'description' => 'Valid description',
            'status' => 'invalid_status',
        ]);

        $response->assertStatus(422);
    }

    public function test_task_status_can_be_valid_values(): void
    {
        $statuses = ['pending', 'in_progress', 'done'];

        foreach ($statuses as $status) {
            $response = $this->withHeaders([
                'Authorization' => 'Bearer ' . $this->token,
            ])->postJson('/api/tasks', [
                'title' => 'Test Task for ' . $status,
                'description' => 'Valid description',
                'status' => $status,
            ]);

            $response->assertStatus(201);
        }
    }
}
