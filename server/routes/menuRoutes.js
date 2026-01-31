const express = require('express');
const router = express.Router();
const {
    getMenuItems,
    searchMenuItems,
    getMenuItem,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleAvailability
} = require('../controllers/menuController');

// Search route must come before :id route
router.get('/search', searchMenuItems);

router.route('/')
    .get(getMenuItems)
    .post(createMenuItem);

router.route('/:id')
    .get(getMenuItem)
    .put(updateMenuItem)
    .delete(deleteMenuItem);

router.patch('/:id/availability', toggleAvailability);

module.exports = router;
