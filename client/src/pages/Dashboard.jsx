import React, { useEffect, useState, memo } from 'react';
import {
    UtensilsCrossed,
    ClipboardList,
    IndianRupee,
    TrendingUp,
    Clock,
    CheckCircle
} from 'lucide-react';
import { PageLoader } from '../components/ui';
import { analyticsAPI, ordersAPI, menuAPI } from '../api';
import './Dashboard.css';

/**
 * Dashboard Page Component
 */
const Dashboard = memo(function Dashboard() {
    const [stats, setStats] = useState(null);
    const [topSellers, setTopSellers] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [menuCount, setMenuCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsRes, topSellersRes, ordersRes, menuRes] = await Promise.all([
                    analyticsAPI.getStats(),
                    analyticsAPI.getTopSellers(),
                    ordersAPI.getAll({ limit: 5 }),
                    menuAPI.getAll()
                ]);

                setStats(statsRes.data?.data);
                setTopSellers(topSellersRes.data?.data || []);
                setRecentOrders(ordersRes.data?.data || []);
                setMenuCount(menuRes.data?.data?.length || 0);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return <PageLoader message="Loading dashboard..." />;
    }

    const statCards = [
        {
            icon: UtensilsCrossed,
            label: 'Menu Items',
            value: menuCount,
            color: 'accent'
        },
        {
            icon: ClipboardList,
            label: 'Total Orders',
            value: stats?.totalOrders || 0,
            color: 'info'
        },
        {
            icon: Clock,
            label: "Today's Orders",
            value: stats?.todayOrders || 0,
            color: 'warning'
        },
        {
            icon: IndianRupee,
            label: "Today's Revenue",
            value: `₹${(stats?.todayRevenue || 0).toFixed(0)}`,
            color: 'success'
        }
    ];

    const getStatusColor = (status) => {
        const colors = {
            'Pending': 'warning',
            'Preparing': 'info',
            'Ready': 'accent',
            'Delivered': 'success',
            'Cancelled': 'error'
        };
        return colors[status] || 'neutral';
    };

    return (
        <div className="dashboard">
            <div className="page-header">
                <h1 className="page-title">Dashboard</h1>
                <p className="page-subtitle">Welcome to your restaurant admin panel</p>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                {statCards.map((stat, idx) => (
                    <div key={idx} className={`stat-card stat-card-${stat.color}`}>
                        <div className="stat-icon">
                            <stat.icon size={24} />
                        </div>
                        <div className="stat-content">
                            <span className="stat-value">{stat.value}</span>
                            <span className="stat-label">{stat.label}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dashboard-grid">
                {/* Top Sellers */}
                <div className="dashboard-card">
                    <div className="card-header">
                        <h2 className="card-title">
                            <TrendingUp size={18} />
                            Top Selling Items
                        </h2>
                    </div>
                    <div className="top-sellers-list">
                        {topSellers.length > 0 ? (
                            topSellers.map((item, idx) => (
                                <div key={item._id} className="top-seller-item">
                                    <span className="rank">{idx + 1}</span>
                                    <div className="seller-info">
                                        <span className="seller-name">{item.name}</span>
                                        <span className="seller-category">{item.category}</span>
                                    </div>
                                    <div className="seller-stats">
                                        <span className="seller-qty">{item.totalQuantity} sold</span>
                                        <span className="seller-revenue">₹{item.totalRevenue?.toFixed(0)}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="empty-text">No sales data yet</p>
                        )}
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="dashboard-card">
                    <div className="card-header">
                        <h2 className="card-title">
                            <ClipboardList size={18} />
                            Recent Orders
                        </h2>
                    </div>
                    <div className="recent-orders-list">
                        {recentOrders.length > 0 ? (
                            recentOrders.map(order => (
                                <div key={order._id} className="recent-order">
                                    <div className="order-info">
                                        <span className="order-id">{order.orderNumber}</span>
                                        <span className="order-customer">{order.customerName}</span>
                                    </div>
                                    <div className="order-meta">
                                        <span className={`status-dot status-${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                        <span className="order-amount">₹{order.totalAmount?.toFixed(0)}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="empty-text">No orders yet</p>
                        )}
                    </div>
                </div>

                {/* Order Status Breakdown */}
                <div className="dashboard-card">
                    <div className="card-header">
                        <h2 className="card-title">
                            <CheckCircle size={18} />
                            Order Status Overview
                        </h2>
                    </div>
                    <div className="status-breakdown">
                        {stats?.statusBreakdown?.map(status => (
                            <div key={status._id} className="status-item">
                                <span className={`status-indicator status-${getStatusColor(status._id)}`} />
                                <span className="status-name">{status._id}</span>
                                <span className="status-count">{status.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
});

export default Dashboard;
