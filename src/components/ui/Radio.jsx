import React from 'react';
import { cn } from '../../lib/utils';

const Radio = ({ checked, onChange, className, label, name, value, ...props }) => {
    return (
        <label className={cn("flex items-center gap-2 cursor-pointer", className)}>
            <div className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                checked ? 'border-[#134E35]' : 'border-gray-300'
            )}>
                {checked && <div className="w-2.5 h-2.5 bg-[#134E35] rounded-full" />}
            </div>
            {label && <span className="text-sm text-gray-600 select-none">{label}</span>}
            <input
                type="radio"
                name={name}
                value={value}
                className="hidden"
                checked={checked}
                onChange={onChange}
                {...props}
            />
        </label>
    );
};

export default Radio;
