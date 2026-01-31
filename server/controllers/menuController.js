const MenuItem = require('../models/MenuItem');

// @desc    Get all menu items with optional filters
// @route   GET /api/menu
// @access  Public
exports.getMenuItems = async (req, res) => {
    try {
        const { category, isAvailable, minPrice, maxPrice, sortBy, order } = req.query;

        // Build filter object
        const filter = {};

        if (category) {
            filter.category = category;
        }

        if (isAvailable !== undefined) {
            filter.isAvailable = isAvailable === 'true';
        }

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = parseFloat(minPrice);
            if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
        }

        // Build sort object
        const sortOptions = {};
        if (sortBy) {
            sortOptions[sortBy] = order === 'desc' ? -1 : 1;
        } else {
            sortOptions.createdAt = -1; // Default: newest first
        }

        const menuItems = await MenuItem.find(filter).sort(sortOptions);

        res.status(200).json({
            success: true,
            count: menuItems.length,
            data: menuItems
        });
    } catch (error) {
        console.error('Error fetching menu items:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching menu items'
        });
    }
};

// @desc    Search menu items by name or ingredients
// @route   GET /api/menu/search
// @access  Public
exports.searchMenuItems = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        // Use text search with MongoDB text index
        const menuItems = await MenuItem.find(
            { $text: { $search: q } },
            { score: { $meta: 'textScore' } }
        ).sort({ score: { $meta: 'textScore' } });

        res.status(200).json({
            success: true,
            count: menuItems.length,
            data: menuItems
        });
    } catch (error) {
        console.error('Error searching menu items:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while searching menu items'
        });
    }
};

// @desc    Get single menu item
// @route   GET /api/menu/:id
// @access  Public
exports.getMenuItem = async (req, res) => {
    try {
        const menuItem = await MenuItem.findById(req.params.id);

        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }

        res.status(200).json({
            success: true,
            data: menuItem
        });
    } catch (error) {
        console.error('Error fetching menu item:', error);

        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error while fetching menu item'
        });
    }
};

// @desc    Create menu item
// @route   POST /api/menu
// @access  Public
exports.createMenuItem = async (req, res) => {
    try {
        const menuItem = await MenuItem.create(req.body);

        res.status(201).json({
            success: true,
            data: menuItem
        });
    } catch (error) {
        console.error('Error creating menu item:', error);

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error while creating menu item'
        });
    }
};

// @desc    Update menu item
// @route   PUT /api/menu/:id
// @access  Public
exports.updateMenuItem = async (req, res) => {
    try {
        const menuItem = await MenuItem.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }

        res.status(200).json({
            success: true,
            data: menuItem
        });
    } catch (error) {
        console.error('Error updating menu item:', error);

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }

        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error while updating menu item'
        });
    }
};

// @desc    Delete menu item
// @route   DELETE /api/menu/:id
// @access  Public
exports.deleteMenuItem = async (req, res) => {
    try {
        const menuItem = await MenuItem.findByIdAndDelete(req.params.id);

        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Menu item deleted successfully',
            data: menuItem
        });
    } catch (error) {
        console.error('Error deleting menu item:', error);

        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error while deleting menu item'
        });
    }
};

// @desc    Toggle menu item availability
// @route   PATCH /api/menu/:id/availability
// @access  Public
exports.toggleAvailability = async (req, res) => {
    try {
        const menuItem = await MenuItem.findById(req.params.id);

        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }

        menuItem.isAvailable = !menuItem.isAvailable;
        await menuItem.save();

        res.status(200).json({
            success: true,
            data: menuItem
        });
    } catch (error) {
        console.error('Error toggling availability:', error);

        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error while toggling availability'
        });
    }
};
