<?php

namespace App\Http\Controllers;

use App\Http\Requests\Task\StoreTaskRequest;
use App\Http\Requests\Task\UpdateTaskRequest;
use App\Http\Resources\TaskCollection;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $tasks = $request->user()
            ->tasks()
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return (new TaskCollection($tasks))->response();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request): JsonResponse
    {
        $task = $request->user()->tasks()->create([
            'title' => $request->title,
            'description' => $request->description,
            'status' => $request->status ?? 'pending',
        ]);

        return (new TaskResource($task))->response()->setStatusCode(201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task, Request $request): JsonResponse
    {
        // Проверяем, что задача принадлежит пользователю
        $this->authorizeUserTask($request->user(), $task);

        return (new TaskResource($task))->response();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request, Task $task): JsonResponse
    {
        // Проверяем, что задача принадлежит пользователю
        $this->authorizeUserTask($request->user(), $task);

        $task->update([
            'title' => $request->title ?? $task->title,
            'description' => $request->description ?? $task->description,
            'status' => $request->status ?? $task->status,
        ]);

        return (new TaskResource($task))->response();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task, Request $request): JsonResponse
    {
        // Проверяем, что задача принадлежит пользователю
        $this->authorizeUserTask($request->user(), $task);

        $task->delete();

        return response()->json([
            'message' => 'Task deleted successfully'
        ]);
    }

    /**
     * Authorize that the user owns the task.
     */
    private function authorizeUserTask($user, Task $task): void
    {
        if ($user->id !== $task->user_id) {
            abort(403, 'This action is unauthorized.');
        }
    }
}
