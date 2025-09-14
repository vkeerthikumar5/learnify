<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
class CourseController extends Controller
{

    // List all courses
    
public function index()
{
    $user = auth()->user();

    // Get all courses created by this admin
    $courses = Course::where('user_id', $user->id)
        ->orderBy('created_at')
        ->get();

    return response()->json($courses);
}

    public function activeCourses()
{
    $user = Auth::user();

    // Get all active courses NOT enrolled by current user
    $courses = Course::where('status', 'active')
        ->whereDoesntHave('enrollments', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
        ->orderBy('created_at', 'desc')
        ->get();

    return response()->json($courses);
}
    

    // Store new course
    public function store(Request $request)
{
    $validated = $request->validate([
        'title' => 'required|string|max:255',
        'description' => 'required|string',
    ]);

    $course = Course::create([
        'title'       => $validated['title'],
        'description' => $validated['description'],
        'user_id'     => auth()->id(), 
        'status'      => 'inactive',
    ]);

    return response()->json($course, 201);
}


    // Show single course
    public function show($id)
    {
        $course = Course::findOrFail($id);
        return response()->json($course);
    }

    // Update course
    public function update(Request $request, $id)
    {
        $course = Course::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        $course->update($validated);

        return response()->json($course);
    }

    // Delete course
    public function destroy($id)
    {
        $course = Course::findOrFail($id);
        $course->delete();

        return response()->json(['message' => 'Course deleted successfully']);
    }

    // App\Http\Controllers\CourseController.php

public function publish($id)
{
    $course = Course::findOrFail($id);
    $course->status = 'active';
    $course->save();

    return response()->json(['message' => 'Course published successfully', 'course' => $course]);
}

// Get all published courses


// Get course details + modules
public function courseDetails($id)
{
    $course = Course::with('modules')->where('id', $id)->where('status', 'active')->firstOrFail();
    return response()->json([
        'course' => $course,
        'modules' => $course->modules,
    ]);
}


// Enroll user in course
public function enroll($id)
{
    $course = Course::where('id', $id)->where('status', 'active')->firstOrFail();
    $user = Auth::user();

    // Check if already enrolled
    if ($course->enrollments()->where('user_id', $user->id)->exists()) {
        return response()->json(['message' => 'Already enrolled'], 400);
    }

    // Create enrollment
    $course->enrollments()->create([
        'user_id' => $user->id
    ]);

    return response()->json(['message' => 'Enrolled successfully']);
}
public function enrolledCourses(Request $request)
{
    $user = auth()->user();

    // Fetch courses where the user is enrolled
    $courses = Course::whereHas('enrollments', function ($q) use ($user) {
        $q->where('user_id', $user->id);
    })
    ->orderBy('created_at', 'desc')
    ->paginate(6); // 6 courses per page

    // Add user_name for frontend display
    $courses->getCollection()->transform(function ($course) {
        $course->user_name = $course->user->name ?? 'Admin';
        return $course;
    });

    return response()->json($courses);
}

}
