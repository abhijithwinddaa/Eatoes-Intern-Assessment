import React, { memo } from 'react';
import { Loader2 } from 'lucide-react';
import './Loader.css';

/**
 * Loading Spinner Component
 */
const Loader = memo(function Loader({
    size = 'md',
    className = ''
}) {
    const sizeMap = {
        sm: 16,
        md: 24,
        lg: 32,
        xl: 48
    };

    return (
        <div className={`loader ${className}`}>
            <Loader2 size={sizeMap[size]} className="loader-spinner" />
        </div>
    );
});

/**
 * Full Page Loading State
 */
export const PageLoader = memo(function PageLoader({ message = 'Loading...' }) {
    return (
        <div className="page-loader">
            <Loader size="lg" />
            <p className="page-loader-text">{message}</p>
        </div>
    );
});

/**
 * Skeleton Loader for Cards
 */
export const CardSkeleton = memo(function CardSkeleton() {
    return (
        <div className="card-skeleton">
            <div className="skeleton skeleton-image" />
            <div className="skeleton-content">
                <div className="skeleton skeleton-title" />
                <div className="skeleton skeleton-text" />
                <div className="skeleton skeleton-text short" />
            </div>
        </div>
    );
});

export default Loader;
