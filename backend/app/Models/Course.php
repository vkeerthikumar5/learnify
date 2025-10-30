<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Enrollment;
class Course extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'description', 'user_id','status'];

    public function modules()
    {
        return $this->hasMany(Modules::class); // use singular 'Module' not 'Modules'
    }

public function user()
{
    return $this->belongsTo(User::class);
}



public function enrollments()
{
    return $this->hasMany(Enrollment::class);
}

}
