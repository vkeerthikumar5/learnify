<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
class StatsController extends Controller
{
   
    public function user_stats()
    {
        $user = Auth::user();
    
        // All active courses
        $allCourses = Course::where('status', 'active')->orderBy('created_at', 'desc')->get();
    
        // Count of courses user is enrolled in
        $enrolledCount = $user->enrollments()->count(); // Assuming Course has enrollments() relation
    
        return response()->json([
            'all_courses' => $allCourses,
            'enrolled_count' => $enrolledCount,
        ]);
    }

    public function admin_stats()
{
    $admin = auth()->user(); // current logged-in admin

    // All courses published by this admin
    $coursesPublished = Course::where('user_id', $admin->id)->count();

    // Active courses published by this admin
    $activeCourses = Course::where('user_id', $admin->id)
        ->where('status', 'active')
        ->count();

    // Total enrollments across all courses by this admin
    $enrollmentsCount = \DB::table('enrollments')
        ->join('courses', 'enrollments.course_id', '=', 'courses.id')
        ->where('courses.user_id', $admin->id)
        ->count();

    return response()->json([
        'courses_published' => $coursesPublished,
        'active_courses'    => $activeCourses,
        'total_enrollments' => $enrollmentsCount,
    ]);
}
public function allEnrollments()
    {
        $admin = Auth::user();

        // ✅ Get course IDs created by this admin
        $courseIds = Course::where('user_id', $admin->id)->pluck('id');

        // ✅ Get enrollments for those courses with user + course relations
        $enrollments = Enrollment::whereIn('course_id', $courseIds)
            ->with(['user', 'course'])
            ->get();

        // ✅ Group enrollments by user and prepare response
        $grouped = $enrollments->groupBy('user_id')->map(function ($userEnrollments) {
            $user = $userEnrollments->first()->user;

            return [
                'id'      => $user->id,
                'name'    => $user->name ?? 'N/A',
                'email'   => $user->email ?? 'N/A',
                'courses' => $userEnrollments->pluck('course.title')->unique()->implode(', '),
            ];
        })->values();

        return response()->json($grouped);
    }

    public function SAEnrollments()
    {
        $enrollments = Enrollment::with(['user', 'course'])->get();
    
        $grouped = $enrollments->groupBy('user_id')->map(function ($userEnrollments) {
            $user = $userEnrollments->first()->user;
    
            return [
                'id'                 => $user->id,
                'name'               => $user->name ?? 'N/A',
                'email'              => $user->email ?? 'N/A',
                'courses'            => $userEnrollments->pluck('course.title')->unique()->implode(', '),
                'applications_count' => $userEnrollments->pluck('course_id')->unique()->count(), // 👈 count courses
            ];
        })->values();
    
        return response()->json($grouped);
    }
    

    public function sa_stats()
{
    // Total normal users
    $totalUsers = User::where('role', 'user')->count();

    // Total admins
    $totalAdmins = User::where('role', 'admin')->count();

    // Pending activations (assuming 'status' field marks active/inactive)
    $pendingActivations = User::where('status', 'pending')->count();

    // Total courses
    $totalCourses = Course::count();

    // Active courses
    $activeCourses = Course::where('status', 'active')->count();

    // Total enrollments across all courses
    $totalEnrollments = \DB::table('enrollments')->count();

    return response()->json([
        'total_users'         => $totalUsers,
        'total_companies'     => $totalAdmins,      
        'pending_activations' => $pendingActivations,
        'total_jobs'          => $totalCourses,      
        'active_jobs'         => $activeCourses,    
        'total_applications'  => $totalEnrollments, 
    ]);
}

}
