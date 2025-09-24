<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Эта миграция будет запускаться для тестов через RefreshDatabase
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Удаление таблиц для тестов
    }
};
