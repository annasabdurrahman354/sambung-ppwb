import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';

const Checkbox = ({ checked, onChange, className, label, ...props }) => {
    return (
        <label className={cn("flex items-center gap-2 cursor-pointer", className)}>
            <div
                onClick={() => onChange(!checked)}
                className={cn(
                    "w-5 h-5 rounded flex items-center justify-center transition-colors border",
                    checked ? 'bg-[#134E35] border-[#134E35]' : 'bg-white/50 border-gray-300'
                )}
            >
                {checked && <Check size={14} className="text-white" />}
            </div>
            {label && <span className="text-sm text-gray-600 select-none">{label}</span>}
            <input
                type="checkbox"
                className="hidden"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                {...props}
            />
        </label>
    );
};

export default Checkbox;
