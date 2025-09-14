<?php
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\dummy;
use App\Http\Controllers\JobController;
use App\Http\Controllers\SAController;
use App\Http\Controllers\ModuleController;
use App\Http\Controllers\StatsController;
use Illuminate\Support\Facades\Route;

// Public
Route::post('register', [AuthController::class, 'register']);
Route::post('recruiter-register', [AuthController::class, 'recruiterRegister']);
Route::post('login', [AuthController::class, 'login']);
Route::post('recruiter-login', [AuthController::class, 'recruiter_login']);

// Protected
Route::middleware('auth:sanctum')->group(function () {
    Route::get('me', [AuthController::class, 'me']);
    

    Route::get('admins',[SAController::class,'view_admins']);
    Route::patch('admins/{id}/toggle-activation', [SAController::class, 'toggleActivation']);

   
    Route::get('users',[StatsController::class,'SAEnrollments']);

    Route::get('admin-profile', [AuthController::class, 'getDetails']);
    Route::post('admin-profile', [AuthController::class, 'storeOrUpdate']);

    Route::get('/courses', [CourseController::class, 'index']);       // List all
    Route::post('/courses', [CourseController::class, 'store']);      // Create
    Route::get('/courses/{id}', [CourseController::class, 'show']);   // Single course (if needed)
    Route::put('/courses/{id}', [CourseController::class, 'update']); // Update
    Route::delete('/courses/{id}', [CourseController::class, 'destroy']); // Delete

    Route::get('/courses/{course}/modules', [ModuleController::class, 'index']);   // List modules of a course
Route::post('/courses/{course}/modules', [ModuleController::class, 'store']);  // Add new module to a course
Route::put('/modules/{module}', [ModuleController::class, 'update']);          // Update a module
Route::delete('/modules/{module}', [ModuleController::class, 'destroy']);      // Delete a module
Route::post('/courses/{id}/publish', [CourseController::class, 'publish']);

Route::get('/user/courses', [CourseController::class, 'activeCourses']);
Route::get('/user/courses/{id}', [CourseController::class, 'courseDetails']);
Route::post('/user/courses/{id}/enroll', [CourseController::class, 'enroll']);
Route::get('/user/enrolled-courses', [CourseController::class, 'enrolledCourses']);
Route::get('/user/stats', [StatsController::class, 'user_stats']);
Route::get('/admin/stats', [StatsController::class, 'admin_stats']);
Route::get('/sa/stats', [StatsController::class, 'sa_stats']);

Route::get('/enrollments', [StatsController::class, 'allEnrollments']);

    Route::post('logout', [AuthController::class, 'logout']);

   


});
