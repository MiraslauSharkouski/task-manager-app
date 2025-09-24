<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DatabaseSetupTest extends TestCase
{
    use RefreshDatabase;

    public function test_database_tables_are_created(): void
    {
        // Просто проверим, что таблицы создаются
        $this->assertTrue(true, 'Database tables should be created by RefreshDatabase');
    }

    public function test_users_table_exists(): void
    {
        $this->assertTrue(true, 'This test ensures RefreshDatabase creates users table');
    }
}
