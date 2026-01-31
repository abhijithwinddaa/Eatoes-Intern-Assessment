import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for data fetching with loading and error states
 * @param {Function} fetchFn - The async function to fetch data
 * @param {Array} deps - Dependencies array for re-fetching
 * @param {Object} options - Additional options
 */
export function useFetch(fetchFn, deps = [], options = {}) {
    const { immediate = true, initialData = null } = options;

    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(immediate);
    const [error, setError] = useState(null);

    const execute = useCallback(async (...args) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetchFn(...args);
            const result = response?.data?.data ?? response?.data ?? response;
            setData(result);
            return result;
        } catch (err) {
            const errorMessage = err?.response?.data?.message || err.message || 'An error occurred';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchFn]);

    const refetch = useCallback((...args) => {
        return execute(...args);
    }, [execute]);

    useEffect(() => {
        if (immediate) {
            execute();
        }
    }, [...deps, immediate]);

    return { data, loading, error, refetch, setData };
}

export default useFetch;
