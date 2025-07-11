import React from 'react';

interface GlassDialogProps {
    isOpen: boolean;
    onClose?: () => void;
    children: React.ReactNode;
    size?: 'small' | 'medium' | 'large' | 'fullscreen';
    showCloseButton?: boolean;
    backdrop?: 'blur' | 'dark' | 'none';
}

export const GlassDialog: React.FC<GlassDialogProps> = ({
    isOpen,
    onClose,
    children,
    size = 'medium',
    showCloseButton = false,
    backdrop = 'blur'
}) => {
    if (!isOpen) return null;

    const sizeClasses = {
        small: 'max-w-md',
        medium: 'max-w-2xl',
        large: 'max-w-4xl',
        fullscreen: 'w-full h-full max-w-none'
    };

    const backdropClasses = {
        blur: 'bg-black/20 backdrop-blur-md',
        dark: 'bg-black/60',
        none: ''
    };

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${backdropClasses[backdrop]}`}>
            {/* Background overlay */}
            <div
                className="absolute inset-0"
                onClick={onClose}
            />

            {/* Dialog content */}
            <div className={`relative ${sizeClasses[size]} ${size === 'fullscreen' ? '' : 'mx-auto'}`}>
                {/* Glassmorphism container */}
                <div className={`
          relative overflow-hidden rounded-2xl
          bg-gradient-to-br from-white/25 to-white/5
          backdrop-blur-xl border border-white/20
          shadow-2xl shadow-black/25
          ${size === 'fullscreen' ? 'h-full' : ''}
        `}>
                    {/* Close button */}
                    {showCloseButton && onClose && (
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
                        >
                            ✕
                        </button>
                    )}

                    {/* Content */}
                    <div className={`relative z-10 ${size === 'fullscreen' ? 'h-full' : 'p-6'}`}>
                        {children}
                    </div>

                    {/* Glass shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />

                    {/* Animated background elements */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-3xl animate-pulse" />
                        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-400/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
                    </div>
                </div>
            </div>
        </div>
    );
}; 