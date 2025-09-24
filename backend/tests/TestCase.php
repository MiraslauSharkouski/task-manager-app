<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    /**
     * Set up the test environment.
     */
    protected function setUp(): void
    {
        parent::setUp();

        // Настройка для тестов
        $this->withoutExceptionHandling();
        
        // Установка тестовой среды
            $this->app->detectEnvironment(function () {
                return 'testing';
            });
        }
    }

    /**
     * Seed the database for testing.
     */
    protected function seedForTesting(): void
    {
        $this->seed([
            \Database\Seeders\TestingSeeder::class,
        ]);
    }
}
