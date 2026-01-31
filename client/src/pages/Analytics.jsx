import React, { useState, useEffect, memo } from 'react';
import { TrendingUp, IndianRupee, ShoppingBag, Award } from 'lucide-react';
import { PageLoader } from '../components/ui';
import { analyticsAPI } from '../api';
import './Analytics.css';

/**
 * Analytics Page
 */
const Analytics = memo(function Analytics() {
    const [topSellers, setTopSellers] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const [topSellersRes, statsRes] = await Promise.all([
                    analyticsAPI.getTopSellers(),
                    analyticsAPI.getStats()
                ]);

                setTopSellers(topSellersRes.data?.data || []);
                setStats(statsRes.data?.data);
            } catch (error) {
                console.error('Error fetching analytics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) {
        return <PageLoader message="Loading analytics..." />;
    }

    const totalRevenue = stats?.statusBreakdown
        ?.filter(s => s._id !== 'Cancelled')
        .reduce((acc, s) => acc + (s.totalRevenue || 0), 0) || 0;

    return (
        <div className="analytics-page">
            <div className="page-header">
                <h1 className="page-title">Analytics</h1>
                <p className="page-subtitle">Insights and performance metrics</p>
            </div>

            {/* Overview Cards */}
            <div className="analytics-overview">
                <div className="overview-card">
                    <div className="overview-icon overview-icon-accent">
                        <IndianRupee size={24} />
                    </div>
                    <div className="overview-content">
                        <span className="overview-value">₹{totalRevenue.toFixed(0)}</span>
                        <span className="overview-label">Total Revenue</span>
                    </div>
                </div>

                <div className="overview-card">
                    <div className="overview-icon overview-icon-info">
                        <ShoppingBag size={24} />
                    </div>
                    <div className="overview-content">
                        <span className="overview-value">{stats?.totalOrders || 0}</span>
                        <span className="overview-label">Total Orders</span>
                    </div>
                </div>

                <div className="overview-card">
                    <div className="overview-icon overview-icon-success">
                        <Award size={24} />
                    </div>
                    <div className="overview-content">
                        <span className="overview-value">
                            {topSellers[0]?.totalQuantity || 0}
                        </span>
                        <span className="overview-label">Top Item Sales</span>
                    </div>
                </div>
            </div>

            {/* Top Sellers Section */}
            <div className="analytics-section">
                <div className="section-header">
                    <h2 className="section-title">
                        <TrendingUp size={20} />
                        Top Selling Items
                    </h2>
                </div>

                {topSellers.length > 0 ? (
                    <div className="top-sellers-table">
                        <div className="table-header">
                            <span>Rank</span>
                            <span>Item</span>
                            <span>Category</span>
                            <span>Orders</span>
                            <span>Quantity Sold</span>
                            <span>Revenue</span>
                        </div>

                        {topSellers.map((item, idx) => (
                            <div key={item._id} className="table-row">
                                <span className={`rank rank-${idx + 1}`}>{idx + 1}</span>
                                <span className="item-name">{item.name}</span>
                                <span className="item-category">{item.category || '-'}</span>
                                <span className="item-orders">{item.orderCount}</span>
                                <span className="item-quantity">{item.totalQuantity}</span>
                                <span className="item-revenue">₹{item.totalRevenue?.toFixed(0)}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-analytics">
                        <p>No sales data available yet</p>
                    </div>
                )}
            </div>

            {/* Order Status Distribution */}
            <div className="analytics-section">
                <div className="section-header">
                    <h2 className="section-title">
                        <ShoppingBag size={20} />
                        Order Status Distribution
                    </h2>
                </div>

                <div className="status-distribution">
                    {stats?.statusBreakdown?.map(status => {
                        const percentage = stats.totalOrders > 0
                            ? ((status.count / stats.totalOrders) * 100).toFixed(1)
                            : 0;

                        return (
                            <div key={status._id} className="distribution-item">
                                <div className="distribution-header">
                                    <span className="distribution-label">{status._id}</span>
                                    <span className="distribution-count">{status.count} orders</span>
                                </div>
                                <div className="distribution-bar">
                                    <div
                                        className={`distribution-fill distribution-${status._id.toLowerCase()}`}
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <span className="distribution-percentage">{percentage}%</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
});

export default Analytics;
