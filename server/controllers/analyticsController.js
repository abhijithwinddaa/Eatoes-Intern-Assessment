const Order = require('../models/Order');

// @desc    Get top 5 selling menu items
// @route   GET /api/analytics/top-sellers
// @access  Public
exports.getTopSellers = async (req, res) => {
    try {
        const topSellers = await Order.aggregate([
            // Only count completed orders (not cancelled)
            { $match: { status: { $ne: 'Cancelled' } } },
            // Unwind the items array
            { $unwind: '$items' },
            // Group by menu item and sum quantities
            {
                $group: {
                    _id: '$items.menuItem',
                    itemName: { $first: '$items.name' },
                    totalQuantity: { $sum: '$items.quantity' },
                    totalRevenue: {
                        $sum: { $multiply: ['$items.quantity', '$items.price'] }
                    },
                    orderCount: { $sum: 1 }
                }
            },
            // Lookup menu item details
            {
                $lookup: {
                    from: 'menuitems',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'menuItemDetails'
                }
            },
            // Unwind the lookup result
            { $unwind: { path: '$menuItemDetails', preserveNullAndEmptyArrays: true } },
            // Project the final shape
            {
                $project: {
                    _id: 1,
                    name: { $ifNull: ['$menuItemDetails.name', '$itemName'] },
                    category: '$menuItemDetails.category',
                    price: '$menuItemDetails.price',
                    imageUrl: '$menuItemDetails.imageUrl',
                    totalQuantity: 1,
                    totalRevenue: 1,
                    orderCount: 1
                }
            },
            // Sort by total quantity sold
            { $sort: { totalQuantity: -1 } },
            // Limit to top 5
            { $limit: 5 }
        ]);

        res.status(200).json({
            success: true,
            count: topSellers.length,
            data: topSellers
        });
    } catch (error) {
        console.error('Error fetching top sellers:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching top sellers'
        });
    }
};

// @desc    Get order statistics
// @route   GET /api/analytics/stats
// @access  Public
exports.getOrderStats = async (req, res) => {
    try {
        const stats = await Order.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalRevenue: { $sum: '$totalAmount' }
                }
            }
        ]);

        const totalOrders = await Order.countDocuments();
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const todayOrders = await Order.countDocuments({
            createdAt: { $gte: todayStart }
        });

        const todayRevenue = await Order.aggregate([
            { $match: { createdAt: { $gte: todayStart }, status: { $ne: 'Cancelled' } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                statusBreakdown: stats,
                totalOrders,
                todayOrders,
                todayRevenue: todayRevenue[0]?.total || 0
            }
        });
    } catch (error) {
        console.error('Error fetching order stats:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching order stats'
        });
    }
};
