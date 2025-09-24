<?php

namespace Tests\Feature\Auth;

use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthorizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_user_cannot_access_protected_routes(): void
    {
        $response = $this->getJson('/api/tasks');
        $response->assertStatus(401);

        $response = $this->postJson('/api/tasks', []);
        $response->assertStatus(401);

        $response = $this->getJson('/api/user');
        $response->assertStatus(401);
    }

    public function test_unauthenticated_user_cannot_access_task_routes(): void
    {
        $user = User::factory()->create();
        $task = Task::factory()->for($user)->create();

        $response = $this->getJson('/api/tasks/' . $task->id);
        $response->assertStatus(401);

        $response = $this->putJson('/api/tasks/' . $task->id, []);
        $response->assertStatus(401);

        $response = $this->deleteJson('/api/tasks/' . $task->id);
        $response->assertStatus(401);
    }

    public function test_authenticated_user_can_access_protected_routes(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/tasks');

        $response->assertStatus(200);
    }

    public function test_user_can_only_access_their_own_tasks(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        
        $task1 = Task::factory()->for($user1)->create();
        $task2 = Task::factory()->for($user2)->create();

        $token1 = $user1->createToken('test-token')->plainTextToken;

        // User 1 should be able to access their own task
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token1,
        ])->getJson('/api/tasks/' . $task1->id);

        $response->assertStatus(200);

        // User 1 should not be able to access user 2's task
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token1,
        ])->getJson('/api/tasks/' . $task2->id);

        $response->assertStatus(403);
    }
}
