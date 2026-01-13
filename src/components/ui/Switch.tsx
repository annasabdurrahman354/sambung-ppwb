import { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export interface SwitchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
    checked: boolean;
    onChange: (checked: boolean) => void;
}

const Switch = ({ checked, onChange, className, ...props }: SwitchProps) => {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={cn(
                "relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#134E35] focus:ring-offset-2",
                checked ? 'bg-[#134E35]' : 'bg-gray-300',
                className
            )}
            {...props}
        >
            <span
                className={cn(
                    "absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow-sm transition-transform duration-300 pointer-events-none",
                    checked ? 'translate-x-6' : 'translate-x-0'
                )}
            />
        </button>
    );
};

export default Switch;
