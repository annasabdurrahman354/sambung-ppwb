import { ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { createPortal } from 'react-dom';

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    className?: string;
    title?: string;
    maxW?: string;
}

const Modal = ({ isOpen, onClose, children, className, maxW = 'max-w-md' }: ModalProps) => {
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            <div
                className={cn(
                    "relative bg-white/80 backdrop-blur-xl border border-white/50 rounded-[24px] shadow-2xl w-full p-6 animate-in fade-in zoom-in duration-200",
                    maxW,
                    className
                )}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={20} />
                </button>
                {/* Title support if needed in future within modal content but current implementation relies on children */}
                {/* {title && <div className="text-xl font-bold mb-4">{title}</div>} */}
                {children}
            </div>
        </div>,
        document.body
    );
};

export default Modal;
