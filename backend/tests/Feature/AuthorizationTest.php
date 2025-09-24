<?php

namespace Tests\Feature;

use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthorizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthorized_access_to_protected_endpoints(): void
    {
        $response = $this->getJson('/api/tasks');
        $response->assertStatus(401);

        $response = $this->postJson('/api/tasks', []);
        $response->assertStatus(401);

        $response = $this->getJson('/api/user');
        $response->assertStatus(401);
    }

    public function test_user_cannot_access_other_users_tasks(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        
        $task = Task::factory()->for($user2)->create();

        $token = $user1->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/tasks/' . $task->id);

        $response->assertStatus(403);
    }

    public function test_user_cannot_update_other_users_tasks(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        
        $task = Task::factory()->for($user2)->create();

        $token = $user1->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->putJson('/api/tasks/' . $task->id, [
            'title' => 'Updated Title',
        ]);

        $response->assertStatus(403);
    }

    public function test_user_cannot_delete_other_users_tasks(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        
        $task = Task::factory()->for($user2)->create();

        $token = $user1->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->deleteJson('/api/tasks/' . $task->id);

        $response->assertStatus(403);
    }

    public function test_authenticated_user_can_access_their_own_tasks(): void
    {
        $user = User::factory()->create();
        $task = Task::factory()->for($user)->create();

        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/tasks/' . $task->id);

        $response->assertStatus(200);
        $response->assertJson([
            'data' => [
                'id' => $task->id,
                'title' => $task->title,
            ]
        ]);
    }

    public function test_authenticated_user_can_update_their_own_tasks(): void
    {
        $user = User::factory()->create();
        $task = Task::factory()->for($user)->create([
            'title' => 'Original Title',
        ]);

        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->putJson('/api/tasks/' . $task->id, [
            'title' => 'Updated Title',
            'status' => 'in_progress',
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'data' => [
                'title' => 'Updated Title',
                'status' => 'in_progress',
            ]
        ]);

        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'title' => 'Updated Title',
            'status' => 'in_progress',
        ]);
    }

    public function test_authenticated_user_can_delete_their_own_tasks(): void
    {
        $user = User::factory()->create();
        $task = Task::factory()->for($user)->create();

        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->deleteJson('/api/tasks/' . $task->id);

        $response->assertStatus(200);
        $response->assertJson([
            'message' => 'Task deleted successfully'
        ]);

        $this->assertDatabaseMissing('tasks', [
            'id' => $task->id,
        ]);
    }
}
