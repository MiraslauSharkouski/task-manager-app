<?php
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo '=== Финальная проверка сущности Task ===' . PHP_EOL;

// Проверим модель
try {
    $task = new App\Models\Task();
    echo '✓ Модель Task загружена' . PHP_EOL;
    echo '  Статусы: ' . implode(', ', $task->getStatuses()) . PHP_EOL;
    echo '  Pending валиден: ' . ($task->isValidStatus('pending') ? 'Да' : 'Нет') . PHP_EOL;
} catch (Exception $e) {
    echo '✗ Ошибка загрузки модели Task: ' . $e->getMessage() . PHP_EOL;
}

// Проверим фабрику (теперь должна работать)
try {
    // Сначала создадим пользователя
    $user = App\Models\User::factory()->create([
        'name' => 'Test User',
        'email' => 'test@example.com',
    ]);
    
    // Теперь создадим задачу через фабрику
    $taskFromFactory = App\Models\Task::factory()->for($user)->make();
    echo '✓ Фабрика Task работает' . PHP_EOL;
    echo '  Заголовок: ' . $taskFromFactory->title . PHP_EOL;
    
    // Попробуем создать задачу
    $createdTask = App\Models\Task::factory()->for($user)->create();
    echo '✓ Создание задачи через фабрику работает (ID: ' . $createdTask->id . ')' . PHP_EOL;
    
} catch (Exception $e) {
    echo '✗ Ошибка фабрики Task: ' . $e->getMessage() . PHP_EOL;
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
    $task = App\Models\Task::first();
    if ($task) {
        $resource = new App\Http\Resources\TaskResource($task);
        $array = $resource->toArray(request());
        echo '✓ TaskResource работает' . PHP_EOL;
        echo '  Поля: ' . implode(', ', array_keys($array)) . PHP_EOL;
    } else {
        echo '⚠ TaskResource: нет задач для проверки' . PHP_EOL;
    }
} catch (Exception $e) {
    echo '✗ Ошибка TaskResource: ' . $e->getMessage() . PHP_EOL;
}

// Проверим данные в базе
echo '=== Проверка данных в базе ===' . PHP_EOL;
echo 'Количество пользователей: ' . App\Models\User::count() . PHP_EOL;
echo 'Количество задач: ' . App\Models\Task::count() . PHP_EOL;

// Проверим связь
$user = App\Models\User::first();
if ($user) {
    echo 'Задач у пользователя ' . $user->name . ': ' . $user->tasks()->count() . PHP_EOL;
}
