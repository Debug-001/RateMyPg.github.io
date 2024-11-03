import React from 'react';
import clsx from 'clsx';

interface ButtonProps {
    className?: string;
    text?: string;
    onClick?: () => void;
    children?: React.ReactNode;  // Add children prop here
    
}

const Button: React.FC<ButtonProps> = ({ className, text = 'Sign In', onClick, children }) => {
    return (
        <div className={clsx('btn btn-primary', className)} onClick={onClick}>
            {children || text}  {/* Render children if provided; otherwise, render text */}
        </div>
    );
};

export default Button;
