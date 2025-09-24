<?php

namespace Database\Seeders;

use Database\Seeders\Testing\TestUserSeeder;
use Database\Seeders\Testing\TestTaskSeeder;
use Illuminate\Database\Seeder;

class TestingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->call([
            TestUserSeeder::class,
            TestTaskSeeder::class,
        ]);
    }
}
