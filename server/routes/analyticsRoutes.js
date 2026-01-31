const express = require('express');
const router = express.Router();
const {
    getTopSellers,
    getOrderStats
} = require('../controllers/analyticsController');

router.get('/top-sellers', getTopSellers);
router.get('/stats', getOrderStats);

module.exports = router;
