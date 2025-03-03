<?php

use App\Http\Controllers\TodoController;
use App\Http\Controllers\Managements\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::prefix('dashboard')->group(function () {
    Route::resource('users', UserController::class);
    
    Route::resource('todos', TodoController::class);
    
    Route::put('/todos/{todo}/toggle-complete', [TodoController::class, 'toggleComplete'])
    ->name('todos.toggle-complete');
    
})->middleware(['auth']);

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
