import React, { useEffect, useCallback, memo } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import Button from './Button';
import './Modal.css';

/**
 * Premium Modal Component
 */
const Modal = memo(function Modal({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    showClose = true,
    closeOnOverlay = true,
    footer,
    className = ''
}) {
    // Handle escape key
    const handleEscape = useCallback((e) => {
        if (e.key === 'Escape') {
            onClose();
        }
    }, [onClose]);

    // Handle overlay click
    const handleOverlayClick = useCallback((e) => {
        if (closeOnOverlay && e.target === e.currentTarget) {
            onClose();
        }
    }, [closeOnOverlay, onClose]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [isOpen, handleEscape]);

    if (!isOpen) return null;

    const modalClasses = [
        'modal',
        `modal-${size}`,
        className
    ].filter(Boolean).join(' ');

    return createPortal(
        <div className="modal-overlay animate-fade-in" onClick={handleOverlayClick}>
            <div className={modalClasses}>
                {/* Header */}
                {(title || showClose) && (
                    <div className="modal-header">
                        {title && <h2 className="modal-title">{title}</h2>}
                        {showClose && (
                            <button
                                className="modal-close"
                                onClick={onClose}
                                aria-label="Close modal"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>
                )}

                {/* Content */}
                <div className="modal-content">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="modal-footer">
                        {footer}
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
});

/**
 * Confirm Dialog Component
 */
export const ConfirmDialog = memo(function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirm Action',
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger',
    loading = false
}) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="sm"
            footer={
                <div className="flex gap-sm justify-end">
                    <Button variant="secondary" onClick={onClose} disabled={loading}>
                        {cancelText}
                    </Button>
                    <Button variant={variant} onClick={onConfirm} loading={loading}>
                        {confirmText}
                    </Button>
                </div>
            }
        >
            <p className="text-secondary">{message}</p>
        </Modal>
    );
});

export default Modal;
