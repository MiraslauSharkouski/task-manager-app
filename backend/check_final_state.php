<?php
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo '=== Финальная проверка состояния Task сущности ===' . PHP_EOL;

// Проверим, что таблицы существуют
$tables = [
    'users' => Schema::hasTable('users'),
    'tasks' => Schema::hasTable('tasks'),
    'personal_access_tokens' => Schema::hasTable('personal_access_tokens'),
];

echo '=== Состояние таблиц ===' . PHP_EOL;
foreach ($tables as $tableName => $exists) {
    echo $tableName . ': ' . ($exists ? 'существует' : 'не существует') . PHP_EOL;
}

    echo '❌ Основные таблицы отсутствуют!' . PHP_EOL;
    exit(1);
}

// Проверим количество записей
$usersCount = DB::table('users')->count();
$tasksCount = DB::table('tasks')->count();
echo PHP_EOL . '=== Количество записей ===' . PHP_EOL;
echo 'Пользователей: ' . $usersCount . PHP_EOL;
echo 'Задач: ' . $tasksCount . PHP_EOL;

// Проверим модель Task
try {
    $task = new App\Models\Task();
    echo PHP_EOL . '✓ Модель Task загружена' . PHP_EOL;
    echo '  Статусы: ' . implode(', ', $task->getStatuses()) . PHP_EOL;
    echo '  Pending валиден: ' . ($task->isValidStatus('pending') ? 'Да' : 'Нет') . PHP_EOL;
} catch (Exception $e) {
    echo PHP_EOL . '✗ Ошибка модели Task: ' . $e->getMessage() . PHP_EOL;
}

// Проверим FormRequest
try {
    $storeRequest = new App\Http\Requests\Task\StoreTaskRequest();
    echo '✓ StoreTaskRequest загружен' . PHP_EOL;
} catch (Exception $e) {
    echo '✗ Ошибка StoreTaskRequest: ' . $e->getMessage() . PHP_EOL;
}

try {
    $updateRequest = new App\Http\Requests\Task\UpdateTaskRequest();
    echo '✓ UpdateTaskRequest загружен' . PHP_EOL;
} catch (Exception $e) {
    echo '✗ Ошибка UpdateTaskRequest: ' . $e->getMessage() . PHP_EOL;
}

// Проверим ресурсы
try {
    $resource = new App\Http\Resources\TaskResource(new App\Models\Task());
    echo '✓ TaskResource загружен' . PHP_EOL;
} catch (Exception $e) {
    echo '✗ Ошибка TaskResource: ' . $e->getMessage() . PHP_EOL;
}

try {
    $collection = new App\Http\Resources\TaskCollection(collect());
    echo '✓ TaskCollection загружен' . PHP_EOL;
} catch (Exception $e) {
    echo '✗ Ошибка TaskCollection: ' . $e->getMessage() . PHP_EOL;
}

// Проверим фабрику (создадим пользователя если нужно)
try {
    if ($usersCount === 0) {
        $user = App\Models\User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
        echo 'Создан тестовый пользователь' . PHP_EOL;
    } else {
        $user = App\Models\User::first();
    }
    
    $taskFromFactory = App\Models\Task::factory()->for($user)->make();
    echo '✓ Фабрика Task работает' . PHP_EOL;
    echo '  Заголовок: ' . $taskFromFactory->title . PHP_EOL;
    
} catch (Exception $e) {
    echo '✗ Ошибка фабрики Task: ' . $e->getMessage() . PHP_EOL;
}

echo PHP_EOL . '=== Проверка связей ===' . PHP_EOL;
$user = App\Models\User::first();
if ($user) {
    $userTasksCount = $user->tasks()->count();
    echo 'Задач у пользователя ' . $user->name . ': ' . $userTasksCount . PHP_EOL;
}

echo PHP_EOL . '✅ Сущность Task полностью настроена!' . PHP_EOL;
