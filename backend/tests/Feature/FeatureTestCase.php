<?php

namespace Tests\Feature;

use Tests\TestCase;

abstract class FeatureTestCase extends TestCase
{
    use \Illuminate\Foundation\Testing\RefreshDatabase;

    /**
     * Set up the feature test environment.
     */
    protected function setUp(): void
    {
        parent::setUp();

        // Дополнительная настройка для Feature тестов
        $this->seedForTesting();
    }

    /**
     * Create an authenticated user for testing.
     */
    protected function createAuthenticatedUser(): \App\Models\User
    {
        $user = \App\Models\User::factory()->create();
        $this->actingAs($user, 'sanctum');
        
        return $user;
    }

    /**
     * Get authentication token for user.
     */
    protected function getAuthToken(\App\Models\User $user): string
    {
        return $user->createToken('test-token')->plainTextToken;
    }
}
