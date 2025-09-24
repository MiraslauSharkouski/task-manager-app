<?php
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo '=== Проверка состояния базы данных ===' . PHP_EOL;

// Проверяем существование таблиц
$tables = [
    'users' => Schema::hasTable('users'),
    'tasks' => Schema::hasTable('tasks'),
    'personal_access_tokens' => Schema::hasTable('personal_access_tokens'),
    'password_resets' => Schema::hasTable('password_resets'),
    'failed_jobs' => Schema::hasTable('failed_jobs'),
    'cache' => Schema::hasTable('cache'),
    'jobs' => Schema::hasTable('jobs'),
];

foreach ($tables as $tableName => $exists) {
    echo $tableName . ': ' . ($exists ? 'существует' : 'не существует') . PHP_EOL;
}

// Проверим количество записей
$usersCount = Schema::hasTable('users') ? DB::table('users')->count() : 0;
$tasksCount = Schema::hasTable('tasks') ? DB::table('tasks')->count() : 0;
$tokensCount = Schema::hasTable('personal_access_tokens') ? DB::table('personal_access_tokens')->count() : 0;

echo 'Количество пользователей: ' . $usersCount . PHP_EOL;
echo 'Количество задач: ' . $tasksCount . PHP_EOL;
echo 'Количество токенов: ' . $tokensCount . PHP_EOL;

// Проверим миграции задач
$tasksMigrationExists = DB::table('migrations')->where('migration', 'like', '%create_tasks_table%')->exists();
echo 'Миграция задач отмечена: ' . ($tasksMigrationExists ? 'Да' : 'Нет') . PHP_EOL;

// Проверим, что все файлы сущности Task существуют
$files = [
    'Task Model' => file_exists('app/Models/Task.php'),
    'Task Factory' => file_exists('database/factories/TaskFactory.php'),
    'Task Seeder' => file_exists('database/seeders/TasksTableSeeder.php'),
    'StoreTaskRequest' => file_exists('app/Http/Requests/Task/StoreTaskRequest.php'),
    'UpdateTaskRequest' => file_exists('app/Http/Requests/Task/UpdateTaskRequest.php'),
    'TaskResource' => file_exists('app/Http/Resources/TaskResource.php'),
    'TaskCollection' => file_exists('app/Http/Resources/TaskCollection.php'),
];

echo PHP_EOL . '=== Проверка файлов сущности Task ===' . PHP_EOL;
foreach ($files as $fileName => $exists) {
    echo $fileName . ': ' . ($exists ? 'существует' : 'не существует') . PHP_EOL;
}
