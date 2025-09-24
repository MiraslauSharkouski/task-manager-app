<?php
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo '=== Создание тестовой задачи ===' . PHP_EOL;

// Найдем или создадим пользователя
$user = App\Models\User::first();
if (!$user) {
    $user = App\Models\User::factory()->create([
        'name' => 'Test User',
        'email' => 'test@example.com',
    ]);
    echo 'Создан тестовый пользователь: ' . $user->email . PHP_EOL;
}

// Создадим задачу
$task = App\Models\Task::create([
    'user_id' => $user->id,
    'title' => 'Test Task Created via PHP',
    'description' => 'This is a test task created via PHP script',
    'status' => 'pending'
]);

echo 'Создана задача: ' . $task->title . PHP_EOL;
echo 'ID: ' . $task->id . PHP_EOL;
echo 'Статус: ' . $task->status . PHP_EOL;
echo 'Пользователь: ' . $task->user->name . PHP_EOL;

// Проверим ресурс
$resource = new App\Http\Resources\TaskResource($task);
$array = $resource->toArray(request());
echo 'Ресурс задачи содержит ' . count($array) . ' полей' . PHP_EOL;

echo '✅ Тестовая задача создана успешно!' . PHP_EOL;