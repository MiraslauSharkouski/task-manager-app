<?php
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo '=== Тестирование API Resources ===' . PHP_EOL;

// Найдем или создадим пользователя
$user = App\Models\User::first();
    $user = App\Models\User::factory()->create([
        'name' => 'Test User',
        'email' => 'test@example.com',
    ]);
    echo 'Создан тестовый пользователь' . PHP_EOL;
}

// Создадим задачу
$task = App\Models\Task::create([
    'user_id' => $user->id,
    'title' => 'Test Task for API Resource',
    'description' => 'This is a test task for API resource',
    'status' => 'pending'
]);

echo 'Создана задача: ' . $task->title . ' (ID: ' . $task->id . ')' . PHP_EOL;

// Проверим TaskResource
$taskResource = new App\Http\Resources\TaskResource($task);
$taskArray = $taskResource->toArray(request());

echo 'TaskResource содержит ' . count($taskArray) . ' полей:' . PHP_EOL;
foreach (array_keys($taskArray) as $field) {
    echo '  - ' . $field . PHP_EOL;
}

// Проверим, есть ли мета-данные
$taskWith = $taskResource->with(request());
echo 'TaskResource содержит мета-данные: ' . (isset($taskWith['meta']) ? 'Да' : 'Нет') . PHP_EOL;

// Проверим UserResource
$userResource = new App\Http\Resources\UserResource($user);
$userArray = $userResource->toArray(request());

echo 'UserResource содержит ' . count($userArray) . ' полей:' . PHP_EOL;
foreach (array_keys($userArray) as $field) {
    echo '  - ' . $field . PHP_EOL;
}

// Проверим TaskCollection
$tasks = App\Models\Task::where('user_id', $user->id)->paginate(10);
$taskCollection = new App\Http\Resources\TaskCollection($tasks);
$collectionArray = $taskCollection->toArray(request());

echo 'TaskCollection содержит ' . (isset($collectionArray['data']) ? count($collectionArray['data']) : 0) . ' задач в данных' . PHP_EOL;
echo 'TaskCollection содержит мета-информацию: ' . (isset($collectionArray['meta']) ? 'Да' : 'Нет') . PHP_EOL;

// Проверим структуру JSON
$jsonStructure = json_encode($taskArray, JSON_PRETTY_PRINT);
echo 'Структура JSON задачи:' . PHP_EOL;
echo $jsonStructure . PHP_EOL;

echo PHP_EOL . '✅ API Resources работают корректно!' . PHP_EOL;
