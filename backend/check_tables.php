<?php
require_once 'vendor/autoload.php';

// Загружаем приложение Laravel
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Проверяем существование таблиц
echo 'Проверка таблиц...' . PHP_EOL;

// Проверяем таблицу users
$usersExist = DB::select('SHOW TABLES LIKE "users"');
echo 'Таблица users: ' . (count($usersExist) > 0 ? 'существует' : 'не существует') . PHP_EOL;

// Проверяем таблицу tasks
$tasksExist = DB::select('SHOW TABLES LIKE "tasks"');
echo 'Таблица tasks: ' . (count($tasksExist) > 0 ? 'существует' : 'не существует') . PHP_EOL;

// Проверяем таблицу personal_access_tokens
$tokensExist = DB::select('SHOW TABLES LIKE "personal_access_tokens"');
echo 'Таблица personal_access_tokens: ' . (count($tokensExist) > 0 ? 'существует' : 'не существует') . PHP_EOL;

// Проверяем миграции
$migrationExists = DB::select('SELECT * FROM migrations WHERE migration LIKE "%create_tasks_table%"');
echo 'Миграция задач: ' . (count($migrationExists) > 0 ? 'отмечена' : 'не отмечена') . PHP_EOL;

// Проверяем количество записей
if (count($tasksExist) > 0) {
    $taskCount = DB::select('SELECT COUNT(*) as count FROM tasks');
    echo 'Количество задач: ' . $taskCount[0]->count . PHP_EOL;
}

if (count($usersExist) > 0) {
    $userCount = DB::select('SELECT COUNT(*) as count FROM users');
    echo 'Количество пользователей: ' . $userCount[0]->count . PHP_EOL;
}
