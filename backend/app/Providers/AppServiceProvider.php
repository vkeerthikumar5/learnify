<?php

namespace App\Providers;

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
    if (file_exists(public_path('build/manifest.json'))) {
        config(['vite.manifest' => public_path('build/manifest.json')]);
    }
}


}
