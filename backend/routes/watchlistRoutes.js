const express = require('express');
const router = express.Router();
const watchlistController = require('../controllers/watchlistController');
const isAuthenticated = require('../middleware/auth');

// Apply authentication middleware to all watchlist routes
router.use(isAuthenticated);

// Get user's watchlist
router.get('/', watchlistController.getWatchlist);

// Add stock to watchlist
router.post('/', watchlistController.addToWatchlist);

// Remove stock from watchlist
router.delete('/:stockId', watchlistController.removeFromWatchlist);

// Update stock data in watchlist
router.put('/:symbol', watchlistController.updateStockData);

module.exports = router;