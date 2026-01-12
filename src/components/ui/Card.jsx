import React from 'react';
import { cn } from '../../lib/utils';

const Card = ({ children, className = '', noPadding = false, ...props }) => {
    return (
        <div
            className={cn(
                "bg-white/60 backdrop-blur-xl rounded-[24px] shadow-xl shadow-emerald-900/5 border border-white/40",
                noPadding ? "" : "p-6",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
