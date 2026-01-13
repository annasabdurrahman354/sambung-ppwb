import { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    noPadding?: boolean;
}

const Card = ({ children, className = '', noPadding = false, ...props }: CardProps) => {
    return (
        <div
            className={cn(
                "bg-white/60 backdrop-blur-xl rounded-[24px] shadow-xl shadow-emerald-900/5 border border-white/40",
                noPadding ? "overflow-hidden" : "p-6",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
