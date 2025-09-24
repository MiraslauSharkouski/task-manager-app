<?php

namespace App\Http\Controllers;

use App\Http\Requests\Task\StoreTaskRequest;
use App\Http\Requests\Task\UpdateTaskRequest;
use App\Http\Resources\TaskCollection;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $tasks = $request->user()
                ->tasks()
                ->orderBy('created_at', 'desc')
                ->paginate(15);

            return (new TaskCollection($tasks))->response();
        } catch (\Exception $e) {
            Log::error('Failed to fetch tasks', [
                'user_id' => $request->user()?->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            
            return response()->json([
                'message' => 'Failed to fetch tasks',
                'error' => 'Internal server error'
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request): JsonResponse
    {
        try {
            $task = $request->user()->tasks()->create([
                'title' => $request->title,
                'description' => $request->description,
                'status' => $request->status ?? 'pending',
            ]);

            return (new TaskResource($task))->response()->setStatusCode(201);
        } catch (\Exception $e) {
            Log::error('Failed to create task', [
                'user_id' => $request->user()->id,
                'input' => $request->validated(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            
            return response()->json([
                'message' => 'Failed to create task',
                'error' => 'Internal server error'
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task, Request $request): JsonResponse
    {
        try {
            // Проверяем, что задача принадлежит пользователю
            $this->authorizeUserTask($request->user(), $task);

            return (new TaskResource($task))->response();
        } catch (\Exception $e) {
            Log::error('Failed to show task', [
                'user_id' => $request->user()?->id,
                'task_id' => $task->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            
            return response()->json([
                'message' => 'Failed to show task',
                'error' => 'Internal server error'
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request, Task $task): JsonResponse
    {
        try {
            // UpdateTaskRequest уже проверяет авторизацию
            
            $task->update([
                'title' => $request->title ?? $task->title,
                'description' => $request->description ?? $task->description,
                'status' => $request->status ?? $task->status,
            ]);

            return (new TaskResource($task))->response();
        } catch (\Exception $e) {
            Log::error('Failed to update task', [
                'user_id' => $request->user()->id,
                'task_id' => $task->id,
                'input' => $request->validated(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            
            return response()->json([
                'message' => 'Failed to update task',
                'error' => 'Internal server error'
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task, Request $request): JsonResponse
    {
        try {
            // Проверяем, что задача принадлежит пользователю
            $this->authorizeUserTask($request->user(), $task);

            $task->delete();

            return response()->json([
                'message' => 'Task deleted successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to delete task', [
                'user_id' => $request->user()?->id,
                'task_id' => $task->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            
            return response()->json([
                'message' => 'Failed to delete task',
                'error' => 'Internal server error'
            ], 500);
        }
    }

    /**
     * Authorize that the user owns the task.
     */
    private function authorizeUserTask($user, Task $task): void
    {
        if ($user->id !== $task->user_id) {
            Log::warning('Unauthorized access attempt', [
                'user_id' => $user->id,
                'task_id' => $task->id,
                'task_owner_id' => $task->user_id,
            ]);
            
            abort(403, 'This action is unauthorized.');
        }
    }
}
