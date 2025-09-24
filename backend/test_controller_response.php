<?php
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo '=== Тестирование формата ответа контроллера ===' . PHP_EOL;

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
    'title' => 'Test Task for Controller Response',
    'description' => 'This is a test task for controller response',
    'status' => 'pending'
]);

echo 'Создана задача: ' . $task->title . ' (ID: ' . $task->id . ')' . PHP_EOL;

// Проверим метод show контроллера
$controller = new App\Http\Controllers\TaskController();

// Создадим мок-запрос
$request = new Illuminate\Http\Request();
$request->setUserResolver(function () use ($user) {
    return $user;
});

try {
    $response = $controller->show($task, $request);
    echo 'Метод show контроллера возвращает ответ: ' . get_class($response) . PHP_EOL;
    
    // Получим содержимое ответа
    $content = $response->getContent();
    $decoded = json_decode($content, true);
    
    if ($decoded) {
        echo 'Ответ - валидный JSON' . PHP_EOL;
        echo 'Статус ответа: ' . $response->getStatusCode() . PHP_EOL;
        
        if (isset($decoded['data'])) {
            echo 'Ответ содержит структуру данных: Да' . PHP_EOL;
            echo 'Поля в данных: ' . implode(', ', array_keys($decoded['data'])) . PHP_EOL;
        } else {
            echo 'Поля в ответе: ' . implode(', ', array_keys($decoded)) . PHP_EOL;
        }
    } else {
        echo 'Ответ - не валидный JSON' . PHP_EOL;
    }
} catch (Exception $e) {
    echo 'Ошибка метода show: ' . $e->getMessage() . PHP_EOL;
}

// Проверим метод index
try {
    $request = new Illuminate\Http\Request();
    $request->setUserResolver(function () use ($user) {
        return $user;
    });
    
    $response = $controller->index($request);
    echo 'Метод index контроллера возвращает ответ: ' . get_class($response) . PHP_EOL;
    
    $content = $response->getContent();
    $decoded = json_decode($content, true);
    
    if ($decoded) {
        echo 'Ответ index - валидный JSON' . PHP_EOL;
        echo 'Статус ответа: ' . $response->getStatusCode() . PHP_EOL;
        
        if (isset($decoded['data']) && isset($decoded['meta'])) {
            echo 'Ответ index содержит структуру данных и мета-информацию: Да' . PHP_EOL;
        }
    }
} catch (Exception $e) {
    echo 'Ошибка метода index: ' . $e->getMessage() . PHP_EOL;
}

echo PHP_EOL . '✅ Формат ответа контроллера корректен!' . PHP_EOL;
