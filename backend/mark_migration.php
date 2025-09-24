<?php
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Найдем имя файла миграции задач
$files = glob('database/migrations/*create_tasks_table*.php');
if (count($files) > 0) {
    $migrationName = basename($files[0], '.php');
    
    // Проверим, не отмечена ли миграция уже
    $existing = DB::table('migrations')->where('migration', $migrationName)->first();

    if (!$existing) {
        $maxBatch = DB::table('migrations')->max('batch') ?? 0;
        $batch = $maxBatch + 1;
        
        DB::table('migrations')->insert([
            'migration' => $migrationName,
            'batch' => $batch
        ]);
        
        echo 'Миграция задач отмечена как выполненная (batch: ' . $batch . ')' . PHP_EOL;
    } else {
        echo 'Миграция задач уже отмечена (batch: ' . $existing->batch . ')' . PHP_EOL;
    }
} else {
    echo 'Файл миграции задач не найден!' . PHP_EOL;
}

// Проверим статус миграций
$migrations = DB::table('migrations')->orderBy('batch')->orderBy('migration')->get();
echo 'Все миграции:' . PHP_EOL;
foreach ($migrations as $migration) {
    echo '  ' . $migration->batch . ': ' . $migration->migration . PHP_EOL;
}