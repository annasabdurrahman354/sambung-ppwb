import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import Badge from './Badge';

export interface MultiSelectOption {
    label: string;
    value: string;
}

interface MultiSelectProps {
    options: MultiSelectOption[];
    selected: string[];
    onChange: (selected: string[]) => void;
    placeholder?: string;
    className?: string;
}

const MultiSelect = ({ options, selected, onChange, placeholder = "Select items...", className }: MultiSelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleOption = (value: string) => {
        const newSelected = selected.includes(value)
            ? selected.filter(v => v !== value)
            : [...selected, value];
        onChange(newSelected);
    };

    const removeOption = (e: React.MouseEvent, value: string) => {
        e.stopPropagation();
        onChange(selected.filter(v => v !== value));
    };

    const selectedLabels = options.filter(opt => selected.includes(opt.value));


    return (
        <div className={cn("relative", className)} ref={containerRef}>
            <div
                className={cn(
                    "w-full pl-4 pr-10 py-2.5 min-h-[46px] rounded-xl bg-white/50 border border-white/60 backdrop-blur-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-[#134E35] focus-within:bg-white/80 transition-all cursor-pointer flex flex-wrap gap-2 items-center",
                )}
                onClick={() => setIsOpen(!isOpen)}
            >
                {selected.length === 0 && (
                    <span className="text-gray-400 select-none block truncate">{placeholder}</span>
                )}
                {selectedLabels.map(opt => (
                    <Badge key={opt.value} variant="neutral" className="pl-2 pr-1 py-0.5 text-xs flex items-center gap-1 bg-white border border-gray-200">
                        {opt.label}
                        <div
                            role="button"
                            onClick={(e) => removeOption(e, opt.value)}
                            className="hover:bg-gray-200 rounded-full p-0.5 transition-colors"
                        >
                            <X size={10} />
                        </div>
                    </Badge>
                ))}
            </div>

            <ChevronDown
                className={cn(
                    "absolute right-3 top-3 text-gray-400 pointer-events-none transition-transform duration-200",
                    isOpen && "transform rotate-180"
                )}
                size={16}
            />

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="max-h-60 overflow-y-auto p-1">
                        {options.length > 0 ? (
                            options.map(opt => {
                                const isSelected = selected.includes(opt.value);
                                return (
                                    <div
                                        key={opt.value}
                                        onClick={() => toggleOption(opt.value)}
                                        className={cn(
                                            "flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors",
                                            isSelected ? "bg-emerald-50 text-emerald-900 font-medium" : "hover:bg-gray-50 text-gray-700"
                                        )}
                                    >
                                        <span>{opt.label}</span>
                                        {isSelected && <Check size={16} className="text-emerald-600" />}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="px-3 py-4 text-center text-sm text-gray-400">
                                No options available
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MultiSelect;
