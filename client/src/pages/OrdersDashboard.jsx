import React, { useState, useEffect, useCallback, memo } from 'react';
import { ClipboardList, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button, PageLoader } from '../components/ui';
import { OrderRow } from '../components/orders';
import { ordersAPI } from '../api';
import './OrdersDashboard.css';

const statuses = ['All', 'Pending', 'Preparing', 'Ready', 'Delivered', 'Cancelled'];

/**
 * Orders Dashboard Page
 */
const OrdersDashboard = memo(function OrdersDashboard() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    });

    // Fetch orders
    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            const params = {
                page: pagination.page,
                limit: pagination.limit
            };

            if (selectedStatus !== 'All') {
                params.status = selectedStatus;
            }

            const response = await ordersAPI.getAll(params);
            const data = response.data;

            setOrders(data.data || []);
            setPagination(prev => ({
                ...prev,
                total: data.total || 0,
                totalPages: data.totalPages || 0
            }));
        } catch (error) {
            toast.error('Failed to load orders');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [selectedStatus, pagination.page, pagination.limit]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    // Handle status change
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await ordersAPI.updateStatus(orderId, newStatus);
            toast.success(`Order status updated to ${newStatus}`);

            // Update local state
            setOrders(prev =>
                prev.map(order =>
                    order._id === orderId ? { ...order, status: newStatus } : order
                )
            );
        } catch (error) {
            toast.error('Failed to update order status');
        }
    };

    // Handle status filter change
    const handleStatusFilter = (status) => {
        setSelectedStatus(status);
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    // Pagination handlers
    const handlePrevPage = () => {
        if (pagination.page > 1) {
            setPagination(prev => ({ ...prev, page: prev.page - 1 }));
        }
    };

    const handleNextPage = () => {
        if (pagination.page < pagination.totalPages) {
            setPagination(prev => ({ ...prev, page: prev.page + 1 }));
        }
    };

    return (
        <div className="orders-dashboard">
            <div className="page-header">
                <h1 className="page-title">Orders</h1>
                <p className="page-subtitle">Manage and track customer orders</p>
            </div>

            {/* Status Filters */}
            <div className="orders-filters">
                <div className="status-filters">
                    {statuses.map(status => (
                        <button
                            key={status}
                            className={`status-filter-btn ${selectedStatus === status ? 'status-filter-active' : ''}`}
                            onClick={() => handleStatusFilter(status)}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Orders List */}
            {loading ? (
                <PageLoader message="Loading orders..." />
            ) : orders.length > 0 ? (
                <>
                    <div className="orders-list">
                        {orders.map(order => (
                            <OrderRow
                                key={order._id}
                                order={order}
                                onStatusChange={handleStatusChange}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="pagination">
                            <Button
                                variant="secondary"
                                size="sm"
                                icon={ChevronLeft}
                                onClick={handlePrevPage}
                                disabled={pagination.page === 1}
                            >
                                Previous
                            </Button>

                            <span className="pagination-info">
                                Page {pagination.page} of {pagination.totalPages}
                                <span className="pagination-total">({pagination.total} orders)</span>
                            </span>

                            <Button
                                variant="secondary"
                                size="sm"
                                icon={ChevronRight}
                                iconPosition="right"
                                onClick={handleNextPage}
                                disabled={pagination.page === pagination.totalPages}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </>
            ) : (
                <div className="empty-state">
                    <ClipboardList size={64} />
                    <h3>No orders found</h3>
                    <p>
                        {selectedStatus !== 'All'
                            ? `No ${selectedStatus.toLowerCase()} orders at the moment`
                            : 'Orders will appear here when customers place them'}
                    </p>
                </div>
            )}
        </div>
    );
});

export default OrdersDashboard;
