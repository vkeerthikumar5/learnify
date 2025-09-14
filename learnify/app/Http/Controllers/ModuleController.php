<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Modules;
use Illuminate\Http\Request;

class ModuleController extends Controller
{
    /**
     * List all modules of a course
     */
    public function index($courseId)
    {
        $course = Course::with('modules')->findOrFail($courseId);
        return response()->json($course->modules);
    }

    /**
     * Store a new module in a course
     */
    public function store(Request $request, $courseId)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'type'  => 'required|in:theory,youtube,quiz',
            'content' => 'nullable', // text, url or quiz json
        ]);

        $course = Course::findOrFail($courseId);

        $module = $course->modules()->create([
            'title' => $request->title,
            'type'  => $request->type,
            'content' => $request->content,
        ]);

        return response()->json($module, 201);
    }

    /**
     * Update a module
     */
    public function update(Request $request, $id)
    {
        $module = Modules::findOrFail($id);

        $request->validate([
            'title' => 'sometimes|string|max:255',
            'type'  => 'sometimes|in:theory,youtube,quiz',
            'content' => 'nullable',
        ]);

        $module->update($request->only(['title', 'type', 'content']));

        return response()->json($module);
    }

    /**
     * Delete a module
     */
    public function destroy($id)
    {
        $module = Modules::findOrFail($id);
        $module->delete();

        return response()->json(['message' => 'Modules deleted successfully']);
    }
}
