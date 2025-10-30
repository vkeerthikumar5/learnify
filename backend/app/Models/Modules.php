<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Modules extends Model
{
    use HasFactory;

    // Allow mass assignment for these fields
    protected $fillable = [
        'course_id',
        'title',
        'type',
        'content',
    ];

    // Relationship with Course
    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
