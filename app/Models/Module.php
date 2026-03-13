<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Module extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'path',
        'icon',
        'item_order',
    ];

    public function profiles()
    {
        return $this->belongsToMany(Profile::class, 'module_profile')->withTimestamps();
    }
}
