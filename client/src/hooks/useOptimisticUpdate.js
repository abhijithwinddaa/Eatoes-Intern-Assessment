import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

/**
 * Custom hook for optimistic UI updates with rollback
 * @param {Function} apiCall - The async API call to make
 * @param {Object} options - Configuration options
 */
export function useOptimisticUpdate(apiCall, options = {}) {
    const {
        onSuccess,
        onError,
        successMessage = 'Updated successfully',
        errorMessage = 'Failed to update. Reverting changes...'
    } = options;

    const [isUpdating, setIsUpdating] = useState(false);

    const execute = useCallback(async (
        updateFn,      // Function to update local state optimistically
        rollbackFn,    // Function to rollback if API fails
        ...apiArgs     // Arguments to pass to the API call
    ) => {
        setIsUpdating(true);

        // Apply optimistic update immediately
        updateFn();

        try {
            const result = await apiCall(...apiArgs);

            if (successMessage) {
                toast.success(successMessage);
            }

            onSuccess?.(result);
            return result;
        } catch (error) {
            // Rollback on error
            rollbackFn();

            const message = error?.response?.data?.message || errorMessage;
            toast.error(message);

            onError?.(error);
            throw error;
        } finally {
            setIsUpdating(false);
        }
    }, [apiCall, onSuccess, onError, successMessage, errorMessage]);

    return { execute, isUpdating };
}

export default useOptimisticUpdate;
