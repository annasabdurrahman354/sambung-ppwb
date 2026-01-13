import { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    status?: string | 'Completed' | 'Success' | 'Pending' | 'Warning' | 'Failed' | 'Error' | 'Info' | 'Neutral';
    variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral'; // Optional variant override if status doesn't match keys
}

const Badge = ({ status, className, variant, children, ...props }: BadgeProps) => {
    const styles: Record<string, string> = {
        Completed: 'bg-green-100/80 text-green-800 backdrop-blur-sm',
        Success: 'bg-green-100/80 text-green-800 backdrop-blur-sm',
        success: 'bg-green-100/80 text-green-800 backdrop-blur-sm',
        Pending: 'bg-yellow-100/80 text-yellow-800 backdrop-blur-sm',
        Warning: 'bg-yellow-100/80 text-yellow-800 backdrop-blur-sm',
        warning: 'bg-yellow-100/80 text-yellow-800 backdrop-blur-sm',
        Failed: 'bg-red-100/80 text-red-800 backdrop-blur-sm',
        Error: 'bg-red-100/80 text-red-800 backdrop-blur-sm',
        error: 'bg-red-100/80 text-red-800 backdrop-blur-sm',
        Info: 'bg-blue-100/80 text-blue-800 backdrop-blur-sm',
        info: 'bg-blue-100/80 text-blue-800 backdrop-blur-sm',
        Neutral: 'bg-gray-100/80 text-gray-800 backdrop-blur-sm',
        neutral: 'bg-gray-100/80 text-gray-800 backdrop-blur-sm',
    };

    // Use variant if provided to determine style, otherwise use status
    const key = variant || status || 'Neutral';
    // Fallback if status key doesn't exist
    const statusStyle = styles[key] || styles['Neutral'];

    return (
        <span
            className={cn("px-3 py-1 rounded-full text-xs font-medium", statusStyle, className)}
            {...props}
        >
            {children || status}
        </span>
    );
};

export default Badge;
