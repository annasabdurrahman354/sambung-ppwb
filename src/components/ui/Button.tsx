import React from 'react';
import { Loader } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
}

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className,
    isLoading = false,
    disabled,
    ...props
}: ButtonProps) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none rounded-full";

    const variants = {
        primary: "bg-[#134E35] text-white hover:bg-[#0c3323] shadow-lg shadow-emerald-900/10",
        secondary: "border border-white/60 bg-white/40 backdrop-blur-sm text-gray-700 hover:bg-white/60",
        ghost: "text-[#134E35] hover:bg-emerald-50/50",
        destructive: "bg-red-50/80 backdrop-blur-sm text-red-600 hover:bg-red-100/80",
        outline: "border border-gray-200 bg-transparent hover:bg-gray-100 text-gray-900",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-6 py-2.5 text-sm",
        lg: "px-8 py-3 text-base",
        icon: "h-10 w-10 p-0",
    };

    return (
        <button
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Loader size={18} className="animate-spin mr-2" />}
            {children}
        </button>
    );
};

export default Button;
