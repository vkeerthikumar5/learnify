<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Custom Vite Manifest Path
    |--------------------------------------------------------------------------
    |
    | This tells Laravel where to look for your Vite build manifest.
    | Since InfinityFree builds placed it under public/build/.vite,
    | we explicitly set that path here.
    |
    */

    'manifest' => public_path('build/.vite/manifest.json'),
];
