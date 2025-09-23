<?php
require_once 'vendor/autoload.php';

try {
    // Загружаем конфигурацию Laravel
    $app = require_once 'bootstrap/app.php';
    $kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
    $kernel->bootstrap();
    
    // Проверяем подключение
    $db = DB::connection()->getPdo();
    echo 'Подключение к базе данных успешно установлено\n';
    echo 'Версия MySQL: ' . $db->getAttribute(PDO::ATTR_SERVER_VERSION) . '\n';
    
} catch (Exception $e) {
    echo 'Ошибка подключения: ' . $e->getMessage() . '\n';
    exit(1);
}
