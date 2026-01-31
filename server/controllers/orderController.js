const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

// @desc    Get all orders with pagination and status filter
// @route   GET /api/orders
// @access  Public
exports.getOrders = async (req, res) => {
    try {
        const { status, page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;

        const filter = {};
        if (status) {
            filter.status = status;
        }

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const sortOptions = {};
        sortOptions[sortBy] = order === 'desc' ? -1 : 1;

        const [orders, total] = await Promise.all([
            Order.find(filter)
                .sort(sortOptions)
                .skip(skip)
                .limit(limitNum)
                .populate('items.menuItem', 'name imageUrl'),
            Order.countDocuments(filter)
        ]);

        res.status(200).json({
            success: true,
            count: orders.length,
            total,
            totalPages: Math.ceil(total / limitNum),
            currentPage: pageNum,
            data: orders
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching orders'
        });
    }
};

// @desc    Get single order with populated menu item details
// @route   GET /api/orders/:id
// @access  Public
exports.getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('items.menuItem', 'name description price imageUrl category');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Error fetching order:', error);

        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error while fetching order'
        });
    }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
exports.createOrder = async (req, res) => {
    try {
        const { items, customerName, tableNumber } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Order must have at least one item'
            });
        }

        // Validate menu items exist and are available
        const menuItemIds = items.map(item => item.menuItem);
        const menuItems = await MenuItem.find({ _id: { $in: menuItemIds } });

        if (menuItems.length !== menuItemIds.length) {
            return res.status(400).json({
                success: false,
                message: 'One or more menu items not found'
            });
        }

        // Check availability and build order items with current prices
        const orderItems = [];
        let totalAmount = 0;

        for (const item of items) {
            const menuItem = menuItems.find(mi => mi._id.toString() === item.menuItem);

            if (!menuItem.isAvailable) {
                return res.status(400).json({
                    success: false,
                    message: `${menuItem.name} is currently not available`
                });
            }

            const itemTotal = menuItem.price * item.quantity;
            totalAmount += itemTotal;

            orderItems.push({
                menuItem: menuItem._id,
                name: menuItem.name,
                quantity: item.quantity,
                price: menuItem.price
            });
        }

        const order = await Order.create({
            items: orderItems,
            totalAmount,
            customerName,
            tableNumber
        });

        res.status(201).json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Error creating order:', error);

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error while creating order'
        });
    }
};

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Public
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const validStatuses = ['Pending', 'Preparing', 'Ready', 'Delivered', 'Cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
            });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Error updating order status:', error);

        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error while updating order status'
        });
    }
};
