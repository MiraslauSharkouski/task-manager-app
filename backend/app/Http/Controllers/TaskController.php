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
     * Get all tasks for the authenticated user
     * 
     * @group Tasks
     * 
     * @authenticated
     * 
     * @queryParam page integer Page number for pagination. Example: 1
     * 
     * @response 200 {
     *   "data": [
     *     {
     *       "id": 1,
     *       "user_id": 1,
     *       "title": "Sample Task",
     *       "description": "This is a sample task",
     *       "status": "pending",
     *       "created_at": "2023-01-01T00:00:00.000000Z",
     *       "updated_at": "2023-01-01T00:00:00.000000Z",
     *       "user": {
     *         "id": 1,
     *         "name": "John Doe",
     *         "email": "john@example.com",
     *         "created_at": "2023-01-01T00:00:00.000000Z",
     *         "updated_at": "2023-01-01T00:00:00.000000Z"
     *       }
     *     }
     *   ],
     *   "links": {
     *     "self": "http://localhost/api/tasks"
     *   },
     *   "meta": {
     *     "total": 1,
     *     "per_page": 15,
     *     "current_page": 1,
     *     "last_page": 1,
     *     "from": 1,
     *     "to": 1,
     *     "api_version": "v1",
     *     "timestamp": "2023-01-01T00:00:00.000000Z"
     *   }
     * }
     * 
     * @param Request $request
     * @return JsonResponse
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
     * Create a new task
     * 
     * @group Tasks
     * 
     * @authenticated
     * 
     * @bodyParam title string required The title of the task. Example: New Task
     * @bodyParam description string The description of the task. Example: This is a new task
     * @bodyParam status string The status of the task. Must be one of: pending, in_progress, done. Default: pending. Example: pending
     * 
     * @response 201 {
     *   "data": {
     *     "id": 1,
     *     "user_id": 1,
     *     "title": "New Task",
     *     "description": "This is a new task",
     *     "status": "pending",
     *     "created_at": "2023-01-01T00:00:00.000000Z",
     *     "updated_at": "2023-01-01T00:00:00.000000Z",
     *     "user": {
     *       "id": 1,
     *       "name": "John Doe",
     *       "email": "john@example.com",
     *       "created_at": "2023-01-01T00:00:00.000000Z",
     *       "updated_at": "2023-01-01T00:00:00.000000Z"
     *     }
     *   },
     *   "meta": {
     *     "api_version": "v1",
     *     "timestamp": "2023-01-01T00:00:00.000000Z"
     *   }
     * }
     * 
     * @param StoreTaskRequest $request
     * @return JsonResponse
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
     * Get a specific task
     * 
     * @group Tasks
     * 
     * @authenticated
     * 
     * @urlParam id integer required The ID of the task. Example: 1
     * 
     * @response 200 {
     *   "data": {
     *     "id": 1,
     *     "user_id": 1,
     *     "title": "Sample Task",
     *     "description": "This is a sample task",
     *     "status": "pending",
     *     "created_at": "2023-01-01T00:00:00.000000Z",
     *     "updated_at": "2023-01-01T00:00:00.000000Z",
     *     "user": {
     *       "id": 1,
     *       "name": "John Doe",
     *       "email": "john@example.com",
     *       "created_at": "2023-01-01T00:00:00.000000Z",
     *       "updated_at": "2023-01-01T00:00:00.000000Z"
     *     }
     *   },
     *   "meta": {
     *     "api_version": "v1",
     *     "timestamp": "2023-01-01T00:00:00.000000Z"
     *   }
     * }
     * 
     * @response 403 {
     *   "message": "This action is unauthorized."
     * }
     * 
     * @param Task $task
     * @param Request $request
     * @return JsonResponse
     */
    public function show(Task $task, Request $request): JsonResponse
    {
        // Проверяем, что задача принадлежит пользователю
        $this->authorizeUserTask($request->user(), $task);

        return (new TaskResource($task))->response();
    }

    /**
     * Update a specific task
     * 
     * @group Tasks
     * 
     * @authenticated
     * 
     * @urlParam id integer required The ID of the task. Example: 1
     * 
     * @bodyParam title string The title of the task. Example: Updated Task Title
     * @bodyParam description string The description of the task. Example: This is an updated task
     * @bodyParam status string The status of the task. Must be one of: pending, in_progress, done. Example: in_progress
     * 
     * @response 200 {
     *   "data": {
     *     "id": 1,
     *     "user_id": 1,
     *     "title": "Updated Task Title",
     *     "description": "This is an updated task",
     *     "status": "in_progress",
     *     "created_at": "2023-01-01T00:00:00.000000Z",
     *     "updated_at": "2023-01-01T00:00:00.000000Z",
     *     "user": {
     *       "id": 1,
     *       "name": "John Doe",
     *       "email": "john@example.com",
     *       "created_at": "2023-01-01T00:00:00.000000Z",
     *       "updated_at": "2023-01-01T00:00:00.000000Z"
     *     }
     *   },
     *   "meta": {
     *     "api_version": "v1",
     *     "timestamp": "2023-01-01T00:00:00.000000Z"
     *   }
     * }
     * 
     * @response 403 {
     *   "message": "This action is unauthorized."
     * }
     * 
     * @param UpdateTaskRequest $request
     * @param Task $task
     * @return JsonResponse
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
     * Delete a specific task
     * 
     * @group Tasks
     * 
     * @authenticated
     * 
     * @urlParam id integer required The ID of the task. Example: 1
     * 
     * @response 200 {
     *   "message": "Task deleted successfully"
     * }
     * 
     * @response 403 {
     *   "message": "This action is unauthorized."
     * }
     * 
     * @param Task $task
     * @param Request $request
     * @return JsonResponse
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
