import { InputHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    checked?: boolean;
    onChange?: () => void;
    label?: string;
    name?: string;
    value?: string;
}

const Radio = ({ checked, onChange, className, label, name, value, ...props }: RadioProps) => {
    return (
        <label className={cn("flex items-center gap-2 cursor-pointer group", className)}>
            <div
                className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center transition-all border-2",
                    checked
                        ? 'border-[#134E35]'
                        : 'border-gray-300 group-hover:border-[#134E35]/50'
                )}
            >
                <div
                    className={cn(
                        "w-2.5 h-2.5 rounded-full bg-[#134E35] transition-transform duration-200",
                        checked ? 'scale-100' : 'scale-0'
                    )}
                />
            </div>
            {label && <span className="text-sm text-gray-700 select-none group-hover:text-gray-900 transition-colors">{label}</span>}
            <input
                type="radio"
                className="hidden"
                name={name}
                value={value}
                checked={checked}
                onChange={onChange}
                {...props}
            />
        </label>
    );
};

export default Radio;
