<?php
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo '=== Проверка валидации FormRequest ===' . PHP_EOL;

// Проверим StoreTaskRequest
$storeRequest = new App\Http\Requests\Task\StoreTaskRequest();
$storeRequest->replace([
    'title' => 'Valid Task Title',
    'description' => 'Valid task description',
    'status' => 'pending'
]);

try {
    $validator = $storeRequest->getValidatorInstance();
    if ($validator->fails()) {
        echo '✗ StoreTaskRequest: ' . implode(', ', $validator->errors()->all()) . PHP_EOL;
    } else {
        echo '✓ StoreTaskRequest валидация пройдена' . PHP_EOL;
    }
} catch (Exception $e) {
    echo '✗ StoreTaskRequest ошибка: ' . $e->getMessage() . PHP_EOL;
}

// Проверим валидацию с неверным статусом
$storeRequest2 = new App\Http\Requests\Task\StoreTaskRequest();
$storeRequest2->replace([
    'title' => 'Valid Task Title',
    'status' => 'invalid_status'
]);

try {
    $validator2 = $storeRequest2->getValidatorInstance();
    if ($validator2->fails()) {
        echo '✓ StoreTaskRequest корректно отклонила неверный статус: ' . implode(', ', $validator2->errors()->all()) . PHP_EOL;
    } else {
        echo '✗ StoreTaskRequest не отклонила неверный статус' . PHP_EOL;
    }
} catch (Exception $e) {
    echo '✗ StoreTaskRequest ошибка при неверном статусе: ' . $e->getMessage() . PHP_EOL;
}

// Проверим UpdateTaskRequest
$updateRequest = new App\Http\Requests\Task\UpdateTaskRequest();
$updateRequest->replace([
    'title' => 'Updated Task Title',
    'status' => 'in_progress'
]);

try {
    $validator3 = $updateRequest->getValidatorInstance();
    if ($validator3->fails()) {
        echo '✗ UpdateTaskRequest: ' . implode(', ', $validator3->errors()->all()) . PHP_EOL;
    } else {
        echo '✓ UpdateTaskRequest валидация пройдена' . PHP_EOL;
    }
} catch (Exception $e) {
    echo '✗ UpdateTaskRequest ошибка: ' . $e->getMessage() . PHP_EOL;
}

echo PHP_EOL . '✅ Валидация FormRequest работает корректно!' . PHP_EOL;
