<?php

namespace Tests\Unit\Models;

use App\Models\Task;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class TaskTest extends TestCase
{
    use WithFaker;

    public function test_task_has_expected_fillable_attributes(): void
    {
        $task = new Task();

        $this->assertEquals([
            'user_id',
            'title',
            'description',
            'status',
        ], $task->getFillable());
    }

    public function test_task_has_expected_casts(): void
    {
        $task = new Task();

        $this->assertArrayHasKey('status', $task->getCasts());
        $this->assertEquals('string', $task->getCasts()['status']);
    }

    public function test_task_status_constants(): void
    {
        $this->assertEquals('pending', Task::STATUS_PENDING);
        $this->assertEquals('in_progress', Task::STATUS_IN_PROGRESS);
        $this->assertEquals('done', Task::STATUS_DONE);
    }

    public function test_task_get_statuses_returns_correct_values(): void
    {
        $statuses = Task::getStatuses();

        $this->assertCount(3, $statuses);
        $this->assertContains('pending', $statuses);
        $this->assertContains('in_progress', $statuses);
        $this->assertContains('done', $statuses);
    }

    public function test_task_is_valid_status_returns_correctly(): void
    {
        $this->assertTrue(Task::isValidStatus('pending'));
        $this->assertTrue(Task::isValidStatus('in_progress'));
        $this->assertTrue(Task::isValidStatus('done'));
        $this->assertFalse(Task::isValidStatus('invalid_status'));
        $this->assertFalse(Task::isValidStatus(''));
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
