<?php
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Проверяем существование таблиц
$tables = [
    'users' => Schema::hasTable('users'),
    'tasks' => Schema::hasTable('tasks'),
    'personal_access_tokens' => Schema::hasTable('personal_access_tokens'),
];

echo '=== Состояние таблиц ===' . PHP_EOL;
foreach ($tables as $tableName => $exists) {
    echo $tableName . ': ' . ($exists ? 'существует' : 'не существует') . PHP_EOL;
}

// Проверим миграции
$migrationExists = DB::table('migrations')->where('migration', 'like', '%create_tasks_table%')->exists();
echo 'Миграция задач отмечена: ' . ($migrationExists ? 'Да' : 'Нет') . PHP_EOL;

// Проверим количество записей
$usersCount = DB::table('users')->count();
$tasksCount = DB::table('tasks')->count();
echo 'Количество пользователей: ' . $usersCount . PHP_EOL;
echo 'Количество задач: ' . $tasksCount . PHP_EOL;
