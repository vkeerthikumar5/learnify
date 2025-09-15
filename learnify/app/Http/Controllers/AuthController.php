<?php

namespace App\Http\Controllers;

use App\Models\User;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // Register
    public function register(Request $request) {
        $request->validate([
            'name'              => 'required|string|max:255',
            'email'             => 'required|email|unique:users',
            'password'          => 'required|min:6',
            'role'              => 'required|in:user,admin',
            
          
        ]);
    
        $user = User::create([
            'name'             => $request->name,
            'email'            => $request->email,
            'role'             => $request->role, 
            'password'         => Hash::make($request->password),
            
           
             
        ]);
    }
    
    
    // Login
    public function login(Request $request) {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);
    
        $user = User::where('email', $request->email)->first();
    
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }
    
        // Check if admin account is active
        if ($user->role === 'admin' && !$user->is_active) {
            return response()->json([
                'message' => 'Your account is pending activation by the super admin.'
            ], 403);
        }
    
        $token = $user->createToken('auth_token')->plainTextToken;
    
        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'role' => $user->role,
            'name' => $user->name,
        ]);
    }
    
    
    // Logout
    public function logout(Request $request) {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out']);
    }

    // Get profile (protected)
    public function me(Request $request) {
        return $request->user();
    }

    public function index()
    {
        $admin_n = User::all();
        return response()->json($admin_n);
    }
    
        
        public function toggleActivation($id) {
            $user = User::findOrFail($id);
            $user->is_active = !$user->is_active;
            $user->save();
        
            return response()->json($user);
        }
        
}
