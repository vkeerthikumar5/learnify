<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use App\Models\Enrollment;
class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'contact_number',
        // new user details
        'dob',
        'gender',
        'address',
        'degree',
        'specialization',
        'college_name',
        'graduation_year',
        'cgpa',
        'skills',
        'projects',
        'internships',
        'applied_jobs_count', // keep track of applied jobs
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }




public function enrollments()
{
    return $this->hasMany(Enrollment::class);
}

public function enrolledCourses()
{
    return $this->belongsToMany(Course::class, 'enrollments');
}
// app/Models/User.php
public function courses()
{
    return $this->hasMany(Course::class, 'user_id');
}

}
