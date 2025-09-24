<?php
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Удаляем таблицу tasks если она существует
if (Schema::hasTable('tasks')) {
    Schema::dropIfExists('tasks');
    echo 'Таблица tasks удалена' . PHP_EOL;
} else {
    echo 'Таблица tasks не существует' . PHP_EOL;
}

// Удаляем запись о миграции задач если она есть
$migrationFiles = glob('database/migrations/*create_tasks_table*.php');
foreach ($migrationFiles as $file) {
    $migrationName = basename($file, '.php');
    DB::table('migrations')->where('migration', $migrationName)->delete();
    echo 'Запись о миграции ' . $migrationName . ' удалена из таблицы migrations' . PHP_EOL;
    unlink($file);
    echo 'Файл миграции ' . $file . ' удален' . PHP_EOL;
}
