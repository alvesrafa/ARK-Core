<?php

use App\Http\Controllers\Profile\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn () => Inertia::render('dashboard'))
    ->middleware('module:dashboard')
    ->name('dashboard');

Route::middleware('module:profiles')
    ->prefix('profiles')
    ->name('profiles.')
    ->group(function () {
        Route::get('/', [ProfileController::class, 'index'])->name('index');
        Route::get('/create', [ProfileController::class, 'create'])->name('create');
        Route::post('/', [ProfileController::class, 'store'])->name('store');
        Route::get('/{id}/edit', [ProfileController::class, 'edit'])->name('edit');
        Route::put('/{id}', [ProfileController::class, 'update'])->name('update');
        Route::delete('/{id}', [ProfileController::class, 'destroy'])->name('destroy');
    });
