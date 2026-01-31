import React, { forwardRef, memo } from 'react';
import { Search, X } from 'lucide-react';
import './Input.css';

/**
 * Premium Input Component
 */
const Input = memo(forwardRef(function Input({
    type = 'text',
    label,
    error,
    icon: Icon,
    clearable = false,
    onClear,
    fullWidth = true,
    className = '',
    ...props
}, ref) {
    const hasValue = props.value && props.value.length > 0;

    const wrapperClasses = [
        'input-wrapper',
        fullWidth && 'input-full',
        error && 'input-error',
        Icon && 'input-has-icon',
        className
    ].filter(Boolean).join(' ');

    return (
        <div className={wrapperClasses}>
            {label && <label className="input-label">{label}</label>}
            <div className="input-container">
                {Icon && <Icon className="input-icon" />}
                <input
                    ref={ref}
                    type={type}
                    className="input"
                    {...props}
                />
                {clearable && hasValue && (
                    <button
                        type="button"
                        className="input-clear"
                        onClick={onClear}
                        aria-label="Clear input"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>
            {error && <span className="input-error-text">{error}</span>}
        </div>
    );
}));

/**
 * Search Input Variant
 */
export const SearchInput = memo(forwardRef(function SearchInput(props, ref) {
    return (
        <Input
            ref={ref}
            type="search"
            icon={Search}
            placeholder="Search..."
            clearable
            {...props}
        />
    );
}));

export default Input;
