import React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { createPortal } from 'react-dom';

const Modal = ({ isOpen, onClose, children, className, title, maxW = 'max-w-md' }) => {
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
                {children}
            </div>
        </div>,
        document.body
    );
};

export default Modal;
