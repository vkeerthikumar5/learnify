<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CourseController;

use App\Http\Controllers\SAController;
use App\Http\Controllers\ModuleController;
use App\Http\Controllers\StatsController;
use Illuminate\Support\Facades\Route;

// Public
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);


// Protected
Route::middleware('auth:sanctum')->group(function () {
    Route::get('me', [AuthController::class, 'me']);
    

    Route::get('admins',[SAController::class,'view_admins']);
    Route::patch('admins/{id}/toggle-activation', [SAController::class, 'toggleActivation']);

   
    

    Route::get('admin-profile', [AuthController::class, 'getDetails']);
    Route::post('admin-profile', [AuthController::class, 'storeOrUpdate']);
    Route::post('logout', [AuthController::class, 'logout']);

    Route::get('/courses', [CourseController::class, 'index']);       
    Route::post('/courses', [CourseController::class, 'store']);      
    Route::get('/courses/{id}', [CourseController::class, 'show']);   
    Route::put('/courses/{id}', [CourseController::class, 'update']); 
    Route::delete('/courses/{id}', [CourseController::class, 'destroy']); 
    Route::post('/courses/{id}/publish', [CourseController::class, 'publish']);
    Route::get('/user/courses', [CourseController::class, 'activeCourses']);
    Route::get('/user/courses/{id}', [CourseController::class, 'courseDetails']);
    Route::post('/user/courses/{id}/enroll', [CourseController::class, 'enroll']);
    Route::get('/user/enrolled-courses', [CourseController::class, 'enrolledCourses']);

    Route::get('/courses/{course}/modules', [ModuleController::class, 'index']);  
    Route::post('/courses/{course}/modules', [ModuleController::class, 'store']);  
    Route::put('/modules/{module}', [ModuleController::class, 'update']);          
    Route::delete('/modules/{module}', [ModuleController::class, 'destroy']);     
    
    Route::get('/user/stats', [StatsController::class, 'user_stats']);
    Route::get('/admin/stats', [StatsController::class, 'admin_stats']);
    Route::get('/sa/stats', [StatsController::class, 'sa_stats']);
    Route::get('/enrollments', [StatsController::class, 'allEnrollments']);
    Route::get('users',[StatsController::class,'SAEnrollments']);

   

   


});
