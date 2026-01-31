import React, { memo } from 'react';
import './Toggle.css';

/**
 * Premium Toggle Switch Component
 */
const Toggle = memo(function Toggle({
    checked,
    onChange,
    disabled = false,
    size = 'md',
    label,
    className = ''
}) {
    const handleChange = () => {
        if (!disabled) {
            onChange?.(!checked);
        }
    };

    const wrapperClasses = [
        'toggle-wrapper',
        disabled && 'toggle-disabled',
        className
    ].filter(Boolean).join(' ');

    const toggleClasses = [
        'toggle',
        `toggle-${size}`,
        checked && 'toggle-checked'
    ].filter(Boolean).join(' ');

    return (
        <div className={wrapperClasses}>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                className={toggleClasses}
                onClick={handleChange}
                disabled={disabled}
            >
                <span className="toggle-thumb" />
            </button>
            {label && (
                <span
                    className="toggle-label"
                    onClick={handleChange}
                >
                    {label}
                </span>
            )}
        </div>
    );
});

export default Toggle;
