import { TodoFilters } from '@/components/todo-filters';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Todo } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { debounce } from 'lodash';
import { MoreVertical, Pencil, PlusIcon, Trash } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Todos',
        href: '/dashboard/todos',
    },
];

export default function Index({
    todos,
    count,
    filters,
}: {
    todos: {
        data: Todo[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{
            url: string;
            label: string;
            active: boolean;
        }>;
    };
    count: {
        total: number;
        completed: number;
        incomplete: number;
    };
    filters: {
        search: string;
        status: string[];
        priorities: string[];
    };
}) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState<string[]>(filters.status || []);
    const [priorities, setPriorities] = useState<string[]>(filters.priorities || []);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

    const {
        data,
        setData,
        post,
        put,
        get,
        delete: destroy,
        processing,
        reset,
    } = useForm<{
        description: string;
        priority: string;
        completed: boolean;
    }>({
        description: '',
        priority: 'low',
        completed: false,
    });

    // Update the debouncedSearch function
    const debouncedSearch = useMemo(() => {
        return debounce((query: string) => {
            if (query.length >= 3 || query.length === 0) {
                get(
                    route('todos.index', {
                        search: query,
                        status,
                        priorities,
                        page: 1,
                    }),
                    {
                        preserveState: true,
                        preserveScroll: true,
                    },
                );
            }
        }, 300);
    }, [status, priorities, get]);

    // Add search handler
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        debouncedSearch(e.target.value);
    };

    const handleStatusChange = (values: string[]) => {
        setStatus(values);
        get(
            route('todos.index', {
                search,
                status: values,
                priorities,
                page: 1,
            }),
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handlePriorityChange = (values: string[]) => {
        setPriorities(values);
        get(
            route('todos.index', {
                search,
                status,
                priorities: values,
                page: 1,
            }),
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleResetFilters = () => {
        setSearch('');
        setStatus([]);
        setPriorities([]);
        get(route('todos.index'), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleCreate = () => {
        post('/dashboard/todos', {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                toast.success('Todo created successfully');
                reset();
            },
        });
    };

    const handleToggleComplete = (todo: Todo) => {
        put(`/dashboard/todos/${todo.id}/toggle-complete`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Todo updated successfully');
                reset();
            },
        });
    };

    const handleEdit = (todo: Todo) => {
        setSelectedTodo(todo);
        setData({
            description: todo.description,
            priority: todo.priority,
            completed: Boolean(todo.completed),
        });
        setIsEditModalOpen(true);
    };

    const handleUpdate = () => {
        if (!selectedTodo) return;
        put(`/dashboard/todos/${selectedTodo.id}`, {
            onSuccess: () => {
                setIsEditModalOpen(false);
                toast.success('Todo updated successfully');
                reset();
            },
        });
    };

    const handleDelete = (todo: Todo) => {
        setSelectedTodo(todo);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (!selectedTodo) return;
        destroy(`/dashboard/todos/${selectedTodo.id}`, {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setSelectedTodo(null);
                toast.success('Todo deleted successfully');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Todos" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        <div className="p-4 text-gray-400">
                            <h1 className="text-2xl tracking-widest uppercase">Total</h1>
                            <h1 className="text-4xl">{count.total}</h1>
                        </div>
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        <div className="p-4 text-gray-400">
                            <h1 className="text-2xl tracking-widest uppercase">Completed</h1>
                            <h1 className="text-4xl">{count.completed}</h1>
                        </div>
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        <div className="p-4 text-gray-400">
                            <h1 className="text-2xl tracking-widest uppercase">Incomplete</h1>
                            <h1 className="text-4xl">{count.incomplete}</h1>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Input placeholder="Search" className="w-full lg:w-64" value={search} onChange={handleSearch} />
                        <TodoFilters
                            onStatusChange={handleStatusChange}
                            onPriorityChange={handlePriorityChange}
                            onReset={handleResetFilters}
                            hasFilters={search !== '' || status.length > 0 || priorities.length > 0}
                        />
                    </div>
                    <Button onClick={() => setIsCreateModalOpen(true)} size={'sm'} variant={'outline'}>
                        <PlusIcon className="mr-2 h-4 w-4" />
                        Add Todo
                    </Button>
                </div>
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 rounded-xl md:min-h-min">
                    <div className="overflow-x-auto rounded-xl">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-sidebar border-accent-foreground border-b text-xs uppercase">
                                <tr className="h-16">
                                    <th className="px-6 py-3">Description</th>
                                    <th className="px-6 py-3">Priority</th>
                                    <th className="px-6 py-3">User</th>
                                    <th className="px-6 py-3">Created At</th>
                                    <th className="px-6 py-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {todos.data.map((todo) => (
                                    <tr
                                        key={todo.id}
                                        className="bg-sidebar border-accent border-b last:border-b-0 hover:bg-gray-200 dark:hover:bg-black/90"
                                    >
                                        <td className={`px-6 py-2 ${todo.completed ? 'font-semibold text-orange-400 line-through' : ''}`}>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={todo.completed}
                                                    onChange={() => handleToggleComplete(todo)}
                                                    className="h-4 w-4 rounded border-gray-300"
                                                />
                                                {todo.description}
                                            </div>
                                        </td>
                                        <td className="px-6 py-2 capitalize">{todo.priority}</td>
                                        <td className="px-6 py-2">{todo.user_id}</td>
                                        <td className="px-6 py-2">{new Date(todo.created_at).toLocaleDateString()}</td>
                                        <td className="float-end px-6 py-2">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        <MoreVertical className="h-4 w-4" />
                                                        <span className="sr-only">Open menu</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-[160px]">
                                                    <DropdownMenuItem onClick={() => handleEdit(todo)}>
                                                        <Pencil className="h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDelete(todo)}>
                                                        <Trash className="h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-6 py-4">
                        <Pagination>
                            {/* Update the pagination section to include search params */}
                            <PaginationContent>
                                {todos.links && todos.links.length > 0 && (
                                    <>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                href={`${todos.links[0]?.url || '#'}${search ? `&search=${search}` : ''}`}
                                                className={!todos.links[0]?.url ? 'pointer-events-none opacity-50' : ''}
                                            />
                                        </PaginationItem>

                                        {todos.links.slice(1, -1).map((link, i) => (
                                            <PaginationItem key={i}>
                                                <PaginationLink
                                                    href={`${link.url || '#'}${search ? `&search=${search}` : ''}`}
                                                    isActive={link.active}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            </PaginationItem>
                                        ))}

                                        <PaginationItem>
                                            <PaginationNext
                                                href={`${todos.links[todos.links.length - 1]?.url || '#'}${search ? `&search=${search}` : ''}`}
                                                className={!todos.links[todos.links.length - 1]?.url ? 'pointer-events-none opacity-50' : ''}
                                            />
                                        </PaginationItem>
                                    </>
                                )}
                            </PaginationContent>
                        </Pagination>
                    </div>
                </div>
            </div>

            {/* Create Modal */}
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Todo</DialogTitle>
                        <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Input placeholder="Description" value={data.description} onChange={(e) => setData('description', e.target.value)} />
                        <Select value={data.priority} onValueChange={(value) => setData('priority', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreate} disabled={processing}>
                            Create
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Todo</DialogTitle>
                        <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Input placeholder="Description" value={data.description} onChange={(e) => setData('description', e.target.value)} />
                        <Select value={data.priority} onValueChange={(value) => setData('priority', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                        </Select>
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={data.completed}
                                onChange={(e) => setData('completed', e.target.checked)}
                                className="rounded border-gray-300"
                            />
                            <span className="cursor-pointer select-none" onClick={() => setData('completed', !data.completed)}>
                                {data.completed ? 'Completed' : 'Not Completed'}
                            </span>
                        </div>{' '}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpdate} disabled={processing}>
                            Update
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Todo</DialogTitle>
                        <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
                    </DialogHeader>
                    <p>Are you sure you want to delete this todo?</p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete} disabled={processing}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
