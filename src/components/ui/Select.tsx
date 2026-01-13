import { SelectHTMLAttributes, forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> { }

const Select = forwardRef<HTMLSelectElement, SelectProps>(({ className, children, ...props }, ref) => {
    return (
        <div className="relative">
            <select
                className={cn(
                    "w-full pl-4 pr-10 py-2.5 rounded-xl bg-white/50 border border-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#134E35] focus:bg-white/80 transition-all appearance-none text-gray-600 disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                ref={ref}
                {...props}
            >
                {children}
            </select>
            <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={16} />
        </div >
    );
});
Select.displayName = "Select";

export default Select;
