import React, { memo } from 'react';
import './Badge.css';

/**
 * Status Badge Component
 */
const Badge = memo(function Badge({
    children,
    variant = 'neutral',
    size = 'md',
    dot = false,
    className = ''
}) {
    const classes = [
        'badge',
        `badge-${variant}`,
        `badge-${size}`,
        className
    ].filter(Boolean).join(' ');

    return (
        <span className={classes}>
            {dot && <span className="badge-dot" />}
            {children}
        </span>
    );
});

/**
 * Order Status Badge with predefined colors
 */
export const OrderStatusBadge = memo(function OrderStatusBadge({ status }) {
    const variantMap = {
        'Pending': 'warning',
        'Preparing': 'info',
        'Ready': 'accent',
        'Delivered': 'success',
        'Cancelled': 'error'
    };

    return (
        <Badge variant={variantMap[status] || 'neutral'} dot>
            {status}
        </Badge>
    );
});

/**
 * Category Badge
 */
export const CategoryBadge = memo(function CategoryBadge({ category }) {
    return (
        <Badge variant="neutral" size="sm">
            {category}
        </Badge>
    );
});

export default Badge;
