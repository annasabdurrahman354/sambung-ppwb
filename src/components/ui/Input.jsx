import React from 'react';
import { cn } from '../../lib/utils';

const Input = React.forwardRef(({ className, icon: Icon, type, ...props }, ref) => {
    return (
        <div className="relative w-full">
            {Icon && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <Icon size={20} />
                </div>
            )}
            <input
                type={type}
                className={cn(
                    "w-full rounded-xl bg-white/50 border border-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#134E35] focus:bg-white/80 transition-all placeholder-gray-400 disabled:cursor-not-allowed disabled:opacity-50",
                    "py-2.5",
                    Icon ? "pl-10 pr-4" : "px-4",
                    className
                )}
                ref={ref}
                {...props}
            />
        </div>
    );
});
Input.displayName = "Input";

export default Input;
