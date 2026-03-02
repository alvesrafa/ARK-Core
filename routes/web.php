<?php

use App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn () => Inertia::render('dashboard'))->name('dashboard');

Route::resource('posts', PostController::class);
