import React, { memo, useState } from 'react';
import { ChevronDown, ChevronUp, User, Hash } from 'lucide-react';
import { OrderStatusBadge } from '../ui';
import './OrderRow.css';

/**
 * Order Row Component
 */
const OrderRow = memo(function OrderRow({
    order,
    onStatusChange
}) {
    const [isExpanded, setIsExpanded] = useState(false);

    const formatDate = (date) => {
        return new Date(date).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const statuses = ['Pending', 'Preparing', 'Ready', 'Delivered', 'Cancelled'];

    return (
        <div className={`order-row ${isExpanded ? 'order-row-expanded' : ''}`}>
            {/* Main Row */}
            <div className="order-row-main" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="order-row-info">
                    <span className="order-number">{order.orderNumber}</span>
                    <OrderStatusBadge status={order.status} />
                </div>

                <div className="order-row-customer">
                    <User size={14} />
                    <span>{order.customerName}</span>
                </div>

                <div className="order-row-table">
                    <Hash size={14} />
                    <span>Table {order.tableNumber}</span>
                </div>

                <div className="order-row-items">
                    <span>{order.items?.length || 0} items</span>
                </div>

                <div className="order-row-total">
                    <span className="total-amount">₹{order.totalAmount?.toFixed(0)}</span>
                </div>

                <div className="order-row-date">
                    <span>{formatDate(order.createdAt)}</span>
                </div>

                <button className="order-row-expand">
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="order-row-details">
                    {/* Items List */}
                    <div className="order-items-section">
                        <h4 className="section-title">Order Items</h4>
                        <div className="order-items-list">
                            {order.items?.map((item, idx) => (
                                <div key={idx} className="order-item">
                                    <span className="item-quantity">{item.quantity}x</span>
                                    <span className="item-name">{item.name}</span>
                                    <span className="item-price">₹{(item.price * item.quantity).toFixed(0)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Status Update */}
                    <div className="order-status-section">
                        <h4 className="section-title">Update Status</h4>
                        <div className="status-buttons">
                            {statuses.map(status => (
                                <button
                                    key={status}
                                    className={`status-btn ${order.status === status ? 'status-btn-active' : ''}`}
                                    onClick={() => onStatusChange(order._id, status)}
                                    disabled={order.status === status}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});

export default OrderRow;
