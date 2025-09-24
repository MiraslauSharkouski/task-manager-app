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
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'status' => [
                'sometimes',
                'string',
                function (\$attribute, \$value, \$fail) {
                    if (!Task::isValidStatus(\$value)) {
                        \$fail('The ' . \$attribute . ' must be one of: ' . implode(', ', Task::getStatuses()) . '.');
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
            'description.string' => 'Описание задачи должно быть строкой.',
            'status.string' => 'Статус задачи должен быть строкой.',
        ];
    }
}