import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

const Select = React.forwardRef(({ className, children, ...props }, ref) => {
    return (
        <div className="relative">
            <select
                className={cn(
                    "w-full px-4 py-2.5 rounded-xl bg-white/50 border border-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#134E35] focus:bg-white/80 transition-all appearance-none text-gray-600 disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                ref={ref}
                {...props}
            >
                {children}
            </select>
            <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={16} />
        </div>
    );
});
Select.displayName = "Select";

export default Select;
