import React from 'react';

export const Scanlines: React.FC = () => {
    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden opacity-[0.03]">
            {/* Scanlines CSS is globally defined but we can add noise here too */}
            <div className="absolute inset-0 scanlines" />
        </div>
    );
};
