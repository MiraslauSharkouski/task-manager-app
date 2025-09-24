<?php
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo '=== Проверка выполненных миграций ===' . PHP_EOL;

$migrations = DB::table('migrations')->orderBy('batch')->orderBy('migration')->get();

foreach ($migrations as $migration) {
    echo $migration->batch . ': ' . $migration->migration . PHP_EOL;
}

// Проверим, существуют ли основные таблицы
$tables = [
    'users' => Schema::hasTable('users'),
    'password_resets' => Schema::hasTable('password_resets'),
    'failed_jobs' => Schema::hasTable('failed_jobs'),
    'personal_access_tokens' => Schema::hasTable('personal_access_tokens'),
    'cache' => Schema::hasTable('cache'),
    'jobs' => Schema::hasTable('jobs'),
    'tasks' => Schema::hasTable('tasks'),
];

echo PHP_EOL . '=== Состояние таблиц ===' . PHP_EOL;
foreach ($tables as $tableName => $exists) {
    echo $tableName . ': ' . ($exists ? 'существует' : 'не существует') . PHP_EOL;
}
