import React from 'react';
import { cn } from '../../lib/utils';

const Badge = ({ status, className, ...props }) => {
    const styles = {
        Completed: 'bg-green-100/80 text-green-800 backdrop-blur-sm',
        Success: 'bg-green-100/80 text-green-800 backdrop-blur-sm',
        Pending: 'bg-yellow-100/80 text-yellow-800 backdrop-blur-sm',
        Warning: 'bg-yellow-100/80 text-yellow-800 backdrop-blur-sm',
        Failed: 'bg-red-100/80 text-red-800 backdrop-blur-sm',
        Error: 'bg-red-100/80 text-red-800 backdrop-blur-sm',
        Info: 'bg-blue-100/80 text-blue-800 backdrop-blur-sm',
        Neutral: 'bg-gray-100/80 text-gray-800 backdrop-blur-sm',
    };

    const statusStyle = styles[status] || 'bg-gray-100/80 text-gray-800 backdrop-blur-sm';

    return (
        <span
            className={cn("px-3 py-1 rounded-full text-xs font-medium", statusStyle, className)}
            {...props}
        >
            {status}
        </span>
    );
};

export default Badge;
