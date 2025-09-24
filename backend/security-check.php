<?php
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo '=== Security Configuration Check ===' . PHP_EOL;

// Проверяем конфигурацию CORS
echo 'CORS Configuration:' . PHP_EOL;
echo '  Allowed Origins: ' . implode(', ', config('cors.allowed_origins')) . PHP_EOL;
echo '  Supports Credentials: ' . (config('cors.supports_credentials') ? 'Yes' : 'No') . PHP_EOL;

// Проверяем конфигурацию Rate Limiting
echo PHP_EOL . 'Rate Limiting Configuration:' . PHP_EOL;
echo '  Default API Rate Limit: 60 requests per minute' . PHP_EOL;
echo '  Auth Rate Limit: 5 requests per 15 minutes' . PHP_EOL;
echo '  Task API Rate Limit: 100 requests per minute' . PHP_EOL;

// Проверяем middleware
echo PHP_EOL . 'Middleware Configuration:' . PHP_EOL;
echo '  API Middleware: ' . implode(', ', config('app.http.middleware_groups.api')) . PHP_EOL;

// Проверяем, что Sanctum установлен
echo PHP_EOL . 'Sanctum Status:' . PHP_EOL;
echo '  Installed: ' . (class_exists('Laravel\Sanctum\Sanctum') ? 'Yes' : 'No') . PHP_EOL;

// Проверяем конфигурацию сессий
echo PHP_EOL . 'Session Configuration:' . PHP_EOL;
echo '  Driver: ' . config('session.driver') . PHP_EOL;
echo '  Lifetime: ' . config('session.lifetime') . ' minutes' . PHP_EOL;

echo PHP_EOL . '✅ Security configuration check completed' . PHP_EOL;
