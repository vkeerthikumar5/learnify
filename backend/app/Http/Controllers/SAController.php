<?php

namespace App\Http\Controllers;


use App\Models\User;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SAController extends Controller
{
    // Fetch only admin users
    public function view_admins()
    {
        $admins = User::where('role', 'admin')
            ->withCount('courses') 
            ->get();
    
        return response()->json($admins);
    }
    


    // Toggle activation status of a recruiter
    public function toggleActivation($id)
    {
        $user = User::where('role', 'admin')->findOrFail($id); // Only admin users
        $user->is_active = !$user->is_active;
        $user->save();

        return response()->json($user);
    }

    public function users()
    {
        $users = User::where('role', 'user')
            ->withCount('enrollments') // counts enrollments
            ->get();
    
        return response()->json($users);
    }
    
    

    
    // Fetch user details
    public function getUserDetails()
{
    $user = Auth::user();
   
    return response()->json([
        'name' => $user->name,
        'email' => $user->email,
        'contact_number' => $user->contact_number,
        
        'dob' => $user->dob,
        'gender' => $user->gender,
        'address' => $user->address,
        'degree' => $user->degree,
        'specialization' => $user->specialization,
        'college_name' => $user->college_name,
        'graduation_year' => $user->graduation_year,
        'cgpa' => $user->cgpa,
        'skills' => $user->skills,
        'projects' => $user->projects,
        'internships' => $user->internships,
    ], 200);
}

    // Create or Update user details
    public function storeOrUpdate(Request $request)
{
    $user = Auth::user(); // Get the logged-in user

    $request->validate([
        'dob' => 'required|date',
        'contact' => 'required|string',
        'gender' => 'required|string',
        'address' => 'required|string|max:255',
        'degree' => 'nullable|string|max:100',
        'specialization' => 'nullable|string|max:100',
        'college_name' => 'nullable|string|max:255',
        'graduation_year' => 'nullable|integer|min:1900|max:2100',
        'cgpa' => 'nullable|max:10',
        'skills' => 'nullable|string',
        'projects' => 'nullable|string',
        'internships' => 'nullable|string',
    ]);

    // Update the existing user directly
    $user->update([
        'dob' => $request->dob,
        'contact_number' => $request->contact,
        'gender' => $request->gender,
        'address' => $request->address,
        'degree' => $request->degree,
        'specialization' => $request->specialization,
        'college_name' => $request->college_name,
        'graduation_year' => $request->graduation_year,
        'cgpa' => $request->cgpa,
        'skills' => $request->skills,
        'projects' => $request->projects,
        'internships' => $request->internships,
    ]);

    return response()->json([
        'message' => 'User details saved successfully',
        'data' => $user
    ], 200);
}
}

