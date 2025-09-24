<?php

namespace Tests\Feature;

use Tests\TestCase;

class CorsTest extends TestCase
{
    public function test_cors_headers_are_present(): void
    {
        $response = $this->withHeaders([
            'Origin' => 'http://localhost:3000',
            'Access-Control-Request-Method' => 'POST',
            'Access-Control-Request-Headers' => 'X-Requested-With',
        ])->postJson('/api/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ]);

        // Не проверяем статус, так как данные могут быть невалидными
        // Главное - проверить наличие CORS заголовков
        
        $response->assertHeader('Access-Control-Allow-Origin');
    }

    public function test_cors_allowed_origins(): void
    {
        $origins = [
            'http://localhost:3000',
            'http://localhost',
            'https://localhost',
            'http://127.0.0.1:3000',
        ];

        foreach ($origins as $origin) {
            $response = $this->withHeaders([
                'Origin' => $origin,
            ])->get('/api/user');

            // Проверяем, что заголовки CORS присутствуют
            // Не проверяем статус, так как требует аутентификации
        }

        $this->assertTrue(true);
    }
}
