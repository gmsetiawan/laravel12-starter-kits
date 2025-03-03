import { Button } from '@/components/ui/button';
import { Command, CommandGroup, CommandItem } from '@/components/ui/command';
import { Check, PlusCircle, X } from 'lucide-react';
import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface TodoFiltersProps {
    onStatusChange: (values: string[]) => void;
    onPriorityChange: (values: string[]) => void;
    onReset: () => void;
    hasFilters: boolean;
}

export function TodoFilters({ onStatusChange, onPriorityChange, onReset, hasFilters }: TodoFiltersProps) {
    const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
    const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);

    const statusOptions = [
        { label: 'Completed', value: 'completed' },
        { label: 'Incomplete', value: 'incomplete' },
    ];

    const priorityOptions = [
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' },
    ];

    const handleStatusToggle = (value: string) => {
        const updated = selectedStatus.includes(value) ? selectedStatus.filter((v) => v !== value) : [...selectedStatus, value];
        setSelectedStatus(updated);
        onStatusChange(updated);
    };

    const handlePriorityToggle = (value: string) => {
        const updated = selectedPriorities.includes(value) ? selectedPriorities.filter((v) => v !== value) : [...selectedPriorities, value];
        setSelectedPriorities(updated);
        onPriorityChange(updated);
    };

    const handleReset = () => {
        setSelectedStatus([]);
        setSelectedPriorities([]);
        onReset();
    };

    return (
        <div className="flex items-center gap-2">
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 border-dashed">
                        <PlusCircle />
                        Status
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0" align="start">
                    <Command className="w-[200px]">
                        <CommandGroup heading="Status">
                            {statusOptions.map((option) => (
                                <CommandItem key={option.value} onSelect={() => handleStatusToggle(option.value)}>
                                    <Check className={`mr-2 h-4 w-4 ${selectedStatus.includes(option.value) ? 'opacity-100' : 'opacity-0'}`} />
                                    {option.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 border-dashed">
                        <PlusCircle />
                        Priority
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0" align="start">
                    <Command className="w-[200px]">
                        <CommandGroup heading="Priority">
                            {priorityOptions.map((option) => (
                                <CommandItem key={option.value} onSelect={() => handlePriorityToggle(option.value)}>
                                    <Check className={`mr-2 h-4 w-4 ${selectedPriorities.includes(option.value) ? 'opacity-100' : 'opacity-0'}`} />
                                    {option.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>

            {hasFilters && (
                <Button variant="outline" size="sm" onClick={handleReset}>
                    <X className="mr-2 h-4 w-4" />
                    Reset Filters
                </Button>
            )}
        </div>
    );
}
