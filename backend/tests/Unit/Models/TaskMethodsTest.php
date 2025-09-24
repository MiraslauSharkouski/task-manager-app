<?php

namespace Tests\Unit\Models;

use App\Models\Task;
use Tests\TestCase;

class TaskMethodsTest extends TestCase
{
    public function test_task_status_methods(): void
    {
        $task = new Task();

        // Тестируем getStatuses
        $statuses = $task->getStatuses();
        $this->assertCount(3, $statuses);
        $this->assertEquals([
            Task::STATUS_PENDING,
            Task::STATUS_IN_PROGRESS,
            Task::STATUS_DONE
        ], $statuses);

        // Тестируем isValidStatus
        $this->assertTrue($task->isValidStatus('pending'));
        $this->assertTrue($task->isValidStatus('in_progress'));
        $this->assertTrue($task->isValidStatus('done'));
        $this->assertFalse($task->isValidStatus('invalid'));
        $this->assertFalse($task->isValidStatus(''));
    }

    public function test_task_status_constants_are_correct(): void
    {
        $this->assertEquals('pending', Task::STATUS_PENDING);
        $this->assertEquals('in_progress', Task::STATUS_IN_PROGRESS);
        $this->assertEquals('done', Task::STATUS_DONE);
    }

    public function test_task_attributes_are_cast_correctly(): void
    {
        $task = new Task();
        $casts = $task->getCasts();

        $this->assertArrayHasKey('status', $casts);
        $this->assertEquals('string', $casts['status']);
    }

    public function test_task_fillable_attributes(): void
    {
        $task = new Task();
        $fillable = $task->getFillable();

        $this->assertContains('user_id', $fillable);
        $this->assertContains('title', $fillable);
        $this->assertContains('description', $fillable);
        $this->assertContains('status', $fillable);
    }
}
