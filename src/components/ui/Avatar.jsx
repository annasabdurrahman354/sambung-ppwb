import React from 'react';
import { cn } from '../../lib/utils';

const Avatar = ({ src, alt, size = 'md', className, ...props }) => {
    const sizes = {
        sm: "w-8 h-8",
        md: "w-10 h-10",
        lg: "w-16 h-16",
        xl: "w-24 h-24"
    };

    return (
        <div
            className={cn(
                "rounded-full border-2 border-white bg-gray-200 overflow-hidden shrink-0 shadow-sm",
                sizes[size] || sizes.md,
                className
            )}
            {...props}
        >
            {src ? (
                <img src={src} alt={alt || 'Avatar'} className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 font-bold">
                    {alt ? alt.charAt(0).toUpperCase() : '?'}
                </div>
            )}
        </div>
    );
};

export default Avatar;
