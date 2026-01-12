import React from 'react';
import { AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';
import { cn } from '../../lib/utils';

const Alert = ({ variant = 'info', title, children, className, ...props }) => {
    const variants = {
        success: {
            container: "bg-emerald-50/60 border-emerald-100/50 text-[#134E35]",
            icon: CheckCircle,
            iconColor: "text-[#134E35]",
            titleColor: "text-[#134E35]"
        },
        warning: {
            container: "bg-amber-50/60 border-amber-100/50 text-amber-800",
            icon: AlertTriangle,
            iconColor: "text-amber-700",
            titleColor: "text-amber-800"
        },
        error: {
            container: "bg-red-50/60 border-red-100/50 text-red-800",
            icon: XCircle,
            iconColor: "text-red-700",
            titleColor: "text-red-800"
        },
        info: {
            container: "bg-blue-50/60 border-blue-100/50 text-blue-800",
            icon: Info,
            iconColor: "text-blue-700",
            titleColor: "text-blue-800"
        }
    };

    const currentVariant = variants[variant] || variants.info;
    const Icon = currentVariant.icon;

    return (
        <div
            className={cn(
                "p-4 border backdrop-blur-sm rounded-xl flex items-start gap-3",
                currentVariant.container,
                className
            )}
            {...props}
        >
            <Icon size={20} className={cn("mt-0.5", currentVariant.iconColor)} />
            <div>
                {title && <h4 className={cn("text-sm font-bold", currentVariant.titleColor)}>{title}</h4>}
                <div className={cn("text-xs mt-1 opacity-90")}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Alert;
