import React from 'react';
import clsx from 'clsx';

interface ButtonProps {
    className?: string; 
    text?: string;      
    onClick?: ()=> void;
}

const Button: React.FC<ButtonProps> = ({ className, text = 'Sign In', onClick }) => {
    return (
        <div className={clsx('btn btn-primary', className, onClick)}>
            {text}
        </div>
    );
};

export default Button;
