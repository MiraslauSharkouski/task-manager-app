<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Cache\RateLimiter;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class ThrottleRequests
{
    /**
     * The rate limiter instance.
     */
    protected RateLimiter $limiter;

    /**
     * Create a new request throttler.
     */
    public function __construct(RateLimiter $limiter)
    {
        $this->limiter = $limiter;
    }

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, string $maxAttempts = '60', string $decayMinutes = '1'): Response
    {
        // Генерируем уникальный ключ для rate limiting
        $key = $this->resolveRequestSignature($request);

        // Проверяем лимиты для различных типов запросов
        $limits = $this->getRequestLimits($request);
        $maxAttempts = $limits['max_attempts'];
        $decayMinutes = $limits['decay_minutes'];

        if ($this->limiter->tooManyAttempts($key, $maxAttempts)) {
            return $this->buildResponse($key, $maxAttempts);
        }

        $this->limiter->hit($key, $decayMinutes * 60);

        $response = $next($request);

        return $this->addHeaders(
            $response, $maxAttempts,
            $this->calculateRemainingAttempts($key, $maxAttempts)
        );
    }

    /**
     * Get request-specific limits.
     */
    protected function getRequestLimits(Request $request): array
    {
        // Разные лимиты для разных типов запросов
        if ($request->is('api/login') || $request->is('api/register')) {
            return [
                'max_attempts' => 5,    // 5 попыток
                'decay_minutes' => 15,   // на 15 минут
            ];
        }

        if ($request->is('api/tasks*')) {
            return [
                'max_attempts' => 100,  // 100 запросов
                'decay_minutes' => 1,    // на 1 минуту
            ];
        }

        // По умолчанию
        return [
            'max_attempts' => 60,     // 60 запросов
            'decay_minutes' => 1,      // на 1 минуту
        ];
    }

    /**
     * Resolve request signature.
     */
    protected function resolveRequestSignature(Request $request): string
    {
        if ($user = $request->user()) {
            return sha1($user->id);
        }

        return sha1($request->ip() . '|' . $request->header('User-Agent'));
    }

    /**
     * Create a 'too many attempts' response.
     */
    protected function buildResponse(string $key, int $maxAttempts): Response
    {
        $retryAfter = $this->limiter->availableIn($key);

        return response()->json([
            'message' => 'Too Many Attempts.',
            'retry_after' => $retryAfter,
        ], 429)->header('Retry-After', $retryAfter);
    }

    /**
     * Add the limit header information to the given response.
     */
    protected function addHeaders(Response $response, int $maxAttempts, int $remainingAttempts): Response
    {
        $response->headers->add([
            'X-RateLimit-Limit' => $maxAttempts,
            'X-RateLimit-Remaining' => $remainingAttempts,
        ]);

        return $response;
    }

    /**
     * Calculate the number of remaining attempts.
     */
    protected function calculateRemainingAttempts(string $key, int $maxAttempts): int
    {
        return $this->limiter->retriesLeft($key, $maxAttempts);
    }
}
