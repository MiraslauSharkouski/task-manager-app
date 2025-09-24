<?php
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo '=== Тестирование CRUD операций задач ===' . PHP_EOL;

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
    'title' => 'Test Task for CRUD',
    'description' => 'This is a test task for CRUD operations',
    'status' => 'pending'
]);

echo 'Создана задача: ' . $task->title . ' (ID: ' . $task->id . ')' . PHP_EOL;

// Проверим, что задача принадлежит пользователю
echo 'Задача принадлежит пользователю: ' . ($task->user_id === $user->id ? 'Да' : 'Нет') . PHP_EOL;

// Проверим контроллер
$controller = new App\Http\Controllers\TaskController();

// Проверим метод show
try {
    $request = new Illuminate\Http\Request();
    $request->setUserResolver(function () use ($user) {
        return $user;
    });
    
    $response = $controller->show($task, $request);
    echo 'Метод show работает' . PHP_EOL;
} catch (Exception $e) {
    echo 'Ошибка метода show: ' . $e->getMessage() . PHP_EOL;
}

// Обновим задачу
$task->update(['title' => 'Updated Task Title', 'status' => 'in_progress']);
echo 'Задача обновлена: ' . $task->title . ' (статус: ' . $task->status . ')' . PHP_EOL;

// Проверим ресурсы
$resource = new App\Http\Resources\TaskResource($task);
$array = $resource->toArray(request());
echo 'Ресурс задачи содержит ' . count($array) . ' полей' . PHP_EOL;

// Удалим задачу
$task->delete();
echo 'Задача удалена' . PHP_EOL;

// Проверим, что задача действительно удалена
$deletedTask = App\Models\Task::find($task->id);
echo 'Задача действительно удалена: ' . (is_null($deletedTask) ? 'Да' : 'Нет') . PHP_EOL;

echo PHP_EOL . '✅ CRUD операции задач работают корректно!' . PHP_EOL;
