<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TodoController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $status = $request->input('status', []); // ['completed', 'incomplete']
        $priorities = $request->input('priorities', []); // ['low', 'medium', 'high']

        // Create base query builder
        $query = Todo::with('user');

        // Create a function to apply all filters
        $applyFilters = function ($query) use ($search, $status, $priorities) {
            // Apply search filter
            if ($search && strlen($search) >= 3) {
                $query->where('description', 'like', "%{$search}%");
            }

            // Apply status filter
            if (!empty($status)) {
                $query->where(function ($q) use ($status) {
                    if (in_array('completed', $status)) {
                        $q->orWhere('completed', true);
                    }
                    if (in_array('incomplete', $status)) {
                        $q->orWhere('completed', false);
                    }
                });
            }

            // Apply priority filter
            if (!empty($priorities)) {
                $query->whereIn('priority', $priorities);
            }

            return $query;
        };

        // Apply filters to main query
        $query = $applyFilters($query);

        // Get the filtered todos with pagination
        $todos = $query->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString()
            ->through(function ($todo) {
                $todo->completed = $todo->completed;
                $todo->user_id = $todo->user->name;
                return $todo;
            });

        // Calculate counts using the same filters
        $totalQuery = Todo::query();
        $totalQuery = $applyFilters($totalQuery);

        $completedCount = (clone $totalQuery)->where('completed', true)->count();
        $incompleteCount = (clone $totalQuery)->where('completed', false)->count();

        return Inertia::render('todos/index', [
            'todos' => $todos,
            'count' => [
                'total' => $todos->total(),
                'completed' => $completedCount,
                'incomplete' => $incompleteCount,
            ],
            'filters' => [
                'search' => $search,
                'status' => $status,
                'priorities' => $priorities,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'description' => 'required|string|max:255',
            'priority' => 'required|in:low,medium,high',
        ]);

        $todo = new Todo($validated);
        $todo->user_id = Auth::id();
        $todo->save();

        return redirect()->back();
    }

    public function update(Request $request, Todo $todo)
    {
        $validated = $request->validate([
            'description' => 'required|string',
            'priority' => 'required|in:low,medium,high',
            'completed' => 'boolean',
        ]);

        $todo->update($validated);

        return redirect()->back();
    }

    public function destroy(Todo $todo)
    {
        $todo->delete();
        return redirect()->back();
    }

    public function toggleComplete(Todo $todo)
    {
        $todo->update([
            'completed' => !$todo->completed
        ]);

        return redirect()->back();
    }
}
