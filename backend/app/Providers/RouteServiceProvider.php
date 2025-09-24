<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * The path to your application's "home" route.
     *
     * Typically, users are redirected here after authentication.
     *
     * @var string
     */
    public const HOME = '/dashboard';

    /**
     * Define your route model bindings, pattern filters, and other route configuration.
     */
    public function boot(): void
    {
        $this->configureRateLimiting();

        $this->routes(function () {
            Route::middleware('api')
                ->prefix('api')
                ->group(base_path('routes/api.php'));

            Route::middleware('web')
                ->group(base_path('routes/web.php'));
        });
    }

    /**
     * Configure the rate limiters for the application.
     */
    protected function configureRateLimiting(): void
    {
        RateLimiter::for('api', function (Request $request) {
            // Разные лимиты для разных типов запросов
            if ($request->is('api/login') || $request->is('api/register')) {
                return Limit::perMinute(5)->by($request->ip()); // 5 попыток в минуту для входа/регистрации
            }

            if ($request->is('api/tasks*')) {
                return Limit::perMinute(100)->by($request->user()?->id ?: $request->ip()); // 100 запросов в минуту для задач
            }

            // По умолчанию 60 запросов в минуту
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });

        // Лимит для всех API запросов
        RateLimiter::for('global', function (Request $request) {
            return Limit::perMinute(1000)->by($request->ip()); // 1000 запросов в минуту на IP
        });
    }
}
