<?php

namespace App\Http\Requests\Task;

use App\Models\Task;
use Illuminate\Foundation\Http\FormRequest;

class UpdateTaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Проверяем, что задача принадлежит пользователю
        $task = $this->route('task');
        return $task && $this->user()->id === $task->user_id;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => [
                'sometimes',
                'string',
                'max:255',
                'min:1',
                'regex:/^[a-zA-Zа-яА-ЯёЁ0-9\s\-_.,!?]+$/u',
            ],
            'description' => [
                'nullable',
                'string',
                'max:1000',
                'regex:/^[a-zA-Zа-яА-ЯёЁ0-9\s\-_.,!?@#$%^&*()\[\]{}|\\:;\"\'<>\/+=~`]*$/u',
            ],
            'status' => [
                'sometimes',
                'string',
                function ($attribute, $value, $fail) {
                    if (!Task::isValidStatus($value)) {
                        $fail('The ' . $attribute . ' must be one of: ' . implode(', ', Task::getStatuses()) . '.');
                    }
                },
            ],
        ];
    }

    /**
     * Get custom messages for validation errors.
     */
    public function messages(): array
    {
        return [
            'title.string' => 'Заголовок задачи должен быть строкой.',
            'title.max' => 'Заголовок задачи не может превышать :max символов.',
            'title.min' => 'Заголовок задачи должен содержать хотя бы :min символ.',
            'title.regex' => 'Заголовок задачи содержит недопустимые символы.',
            'description.string' => 'Описание задачи должно быть строкой.',
            'description.max' => 'Описание задачи не может превышать :max символов.',
            'description.regex' => 'Описание задачи содержит недопустимые символы.',
            'status.string' => 'Статус задачи должен быть строкой.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        if ($this->title) {
            $this->merge([
                'title' => trim(strip_tags($this->title)),
            ]);
        }
        
        if ($this->description) {
            $this->merge([
                'description' => trim(strip_tags($this->description)),
            ]);
        }
    }
}