import React, { memo } from 'react';
import { Loader2 } from 'lucide-react';
import './Button.css';

/**
 * Premium Button Component
 */
const Button = memo(function Button({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    fullWidth = false,
    icon: Icon,
    iconPosition = 'left',
    onClick,
    type = 'button',
    className = '',
    ...props
}) {
    const classes = [
        'btn',
        `btn-${variant}`,
        `btn-${size}`,
        fullWidth && 'btn-full',
        loading && 'btn-loading',
        className
    ].filter(Boolean).join(' ');

    return (
        <button
            type={type}
            className={classes}
            disabled={disabled || loading}
            onClick={onClick}
            {...props}
        >
            {loading ? (
                <Loader2 className="btn-spinner" size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
            ) : (
                <>
                    {Icon && iconPosition === 'left' && <Icon className="btn-icon btn-icon-left" />}
                    <span>{children}</span>
                    {Icon && iconPosition === 'right' && <Icon className="btn-icon btn-icon-right" />}
                </>
            )}
        </button>
    );
});

export default Button;
