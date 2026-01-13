import { ImgHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Avatar = ({ src, alt, size = 'md', className, ...props }: AvatarProps) => {
    const sizes = {
        sm: "w-8 h-8",
        md: "w-10 h-10",
        lg: "w-12 h-12",
        xl: "w-16 h-16",
    };

    return (
        <div className={cn("relative rounded-full overflow-hidden border-2 border-white shadow-sm bg-gray-100", sizes[size], className)}>
            <img
                src={src}
                alt={alt || "Avatar"}
                className="w-full h-full object-cover"
                {...props}
            />
        </div>
    );
};

export default Avatar;
