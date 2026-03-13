<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProfileModule extends Model
{
    use HasFactory;

    protected $table = 'module_profile';

    protected $fillable = [
        'module_id',
        'profile_id',
    ];
}
