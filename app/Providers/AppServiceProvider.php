<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureRateLimiting();
    }

    /**
     * Per-user limits on everything that writes to the site, and a per-IP
     * limit on registration, so one account or one machine cannot flood it.
     */
    protected function configureRateLimiting(): void
    {
        $byUser = fn (Request $request) => $request->user()?->id ?: $request->ip();

        RateLimiter::for('register', fn (Request $request) => Limit::perHour(5)->by($request->ip()));
        RateLimiter::for('posts', fn (Request $request) => Limit::perHour(10)->by($byUser($request)));
        RateLimiter::for('comments', fn (Request $request) => Limit::perMinute(10)->by($byUser($request)));
        RateLimiter::for('votes', fn (Request $request) => Limit::perMinute(30)->by($byUser($request)));
        RateLimiter::for('reports', fn (Request $request) => Limit::perHour(20)->by($byUser($request)));
    }
}
