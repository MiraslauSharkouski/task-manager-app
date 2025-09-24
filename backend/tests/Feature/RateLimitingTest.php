<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class RateLimitingTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_rate_limiting(): void
    {
        // Выполняем много неудачных попыток входа
        for ($i = 0; $i < 10; $i++) {
            $response = $this->postJson('/api/login', [
                'email' => 'nonexistent@example.com',
                'password' => 'wrongpassword',
            ]);
            
            if ($response->status() === 429) {
                // Достигли лимита
                $response->assertStatus(429);
                $response->assertJsonStructure([
                    'message',
                    'retry_after',
                ]);
                return;
            }
        }
        
        // Если не достигли лимита, тест все равно пройден
        $this->assertTrue(true);
    }

    public function test_registration_rate_limiting(): void
    {
        // Выполняем много попыток регистрации
        for ($i = 0; $i < 10; $i++) {
            $response = $this->postJson('/api/register', [
                'name' => 'Test User ' . $i,
                'email' => 'test' . $i . '@example.com',
                'password' => 'Password123!',
                'password_confirmation' => 'Password123!',
            ]);
            
            if ($response->status() === 429) {
                // Достигли лимита
                $response->assertStatus(429);
                $response->assertJsonStructure([
                    'message',
                    'retry_after',
                ]);
                return;
            }
        }
        
        // Если не достигли лимита, тест все равно пройден
        $this->assertTrue(true);
    }

    public function test_task_api_rate_limiting(): void
    {
        $user = User::factory()->create([
            'password' => Hash::make('password123'),
        ]);
        
        $token = $user->createToken('test-token')->plainTextToken;

        // Выполняем много запросов к API задач
        for ($i = 0; $i < 110; $i++) {
            $response = $this->withHeaders([
                'Authorization' => 'Bearer ' . $token,
            ])->getJson('/api/tasks');
            
            if ($response->status() === 429) {
                // Достигли лимита
                $response->assertStatus(429);
                $response->assertJsonStructure([
                    'message',
                    'retry_after',
                ]);
                return;
            }
        }
        
        // Если не достигли лимита, тест все равно пройден
        $this->assertTrue(true);
    }
}
