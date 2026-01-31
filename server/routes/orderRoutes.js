const express = require('express');
const router = express.Router();
const {
    getOrders,
    getOrder,
    createOrder,
    updateOrderStatus
} = require('../controllers/orderController');

router.route('/')
    .get(getOrders)
    .post(createOrder);

router.route('/:id')
    .get(getOrder);

router.patch('/:id/status', updateOrderStatus);

module.exports = router;
