<?php

return [
    'theme' => 'default',
    'title' => 'Task Manager API',
    'description' => 'Task Manager API Documentation',
    'base_url' => config('app.url'),
    'routes' => [
        [
            'match' => [
                'domains' => ['*'],
                'prefixes' => ['api/*'],
                'middleware' => ['api'],
            ],
        ],
    ],
    'type' => 'static',
    'static' => [
        'output_path' => 'public/docs',
    ],
    'auth' => [
        'enabled' => false,
    ],
    'example_languages' => ['bash'],
    'postman' => [
        'enabled' => false,
    ],
    'openapi' => [
        'enabled' => false,
    ],
    'router' => 'laravel',
];
