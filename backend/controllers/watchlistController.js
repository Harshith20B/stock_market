// controllers/watchlistController.js
const Watchlist = require('../models/Watchlist');

// Get user's watchlist
const getWatchlist = async (req, res) => {
  try {
    const userId = req.session.user?.id || req.user._id;
    
    // Find watchlist for user, or create one if it doesn't exist
    let watchlist = await Watchlist.findOne({ user: userId });
    
    if (!watchlist) {
      // Create empty watchlist if none exists
      watchlist = new Watchlist({ user: userId, stocks: [] });
      await watchlist.save();
    }
    
    // Return watchlist stocks with temporary IDs for frontend use
    const watchlistWithIds = watchlist.stocks.map((stock, index) => ({
      _id: stock._id || index,
      symbol: stock.symbol,
      name: stock.name,
      price: stock.price,
      change: stock.change,
      lastUpdated: stock.lastUpdated
    }));
    
    res.status(200).json({ 
      watchlist: watchlistWithIds
    });
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Add stock to watchlist
const addToWatchlist = async (req, res) => {
  try {
    const { symbol, name, price, change } = req.body;
    const userId = req.session.user?.id || req.user._id;
    
    if (!symbol || !name) {
      return res.status(400).json({ message: 'Symbol and name are required' });
    }
    
    // Find user's watchlist or create one
    let watchlist = await Watchlist.findOne({ user: userId });
    
    if (!watchlist) {
      watchlist = new Watchlist({ user: userId, stocks: [] });
    }
    
    // Check if stock already exists in watchlist
    const stockExists = watchlist.stocks.some(stock => stock.symbol === symbol);
    
    if (stockExists) {
      return res.status(400).json({ message: 'Stock already in watchlist' });
    }
    
    // Add stock to watchlist
    watchlist.stocks.push({
      symbol,
      name,
      price: price || 0,
      change: change || 0,
      lastUpdated: Date.now()
    });
    
    await watchlist.save();
    
    res.status(200).json({ 
      message: 'Stock added to watchlist',
      stock: watchlist.stocks[watchlist.stocks.length - 1]
    });
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Remove stock from watchlist
const removeFromWatchlist = async (req, res) => {
  try {
    const { stockId } = req.params;
    const userId = req.session.user?.id || req.user._id;
    
    // Find user's watchlist
    const watchlist = await Watchlist.findOne({ user: userId });
    
    if (!watchlist) {
      return res.status(404).json({ message: 'Watchlist not found' });
    }
    
    // Remove stock from watchlist
    watchlist.stocks = watchlist.stocks.filter(stock => 
      stock._id.toString() !== stockId
    );
    
    await watchlist.save();
    
    res.status(200).json({ 
      message: 'Stock removed from watchlist'
    });
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Update stock price data in watchlist
const updateStockData = async (req, res) => {
  try {
    const { symbol, price, change } = req.body;
    const userId = req.session.user?.id || req.user._id;
    
    // Find user's watchlist
    const watchlist = await Watchlist.findOne({ user: userId });
    
    if (!watchlist) {
      return res.status(404).json({ message: 'Watchlist not found' });
    }
    
    // Find the stock and update it
    const stockIndex = watchlist.stocks.findIndex(stock => stock.symbol === symbol);
    
    if (stockIndex === -1) {
      return res.status(404).json({ message: 'Stock not found in watchlist' });
    }
    
    // Update stock data
    watchlist.stocks[stockIndex].price = price;
    watchlist.stocks[stockIndex].change = change;
    watchlist.stocks[stockIndex].lastUpdated = Date.now();
    
    await watchlist.save();
    
    res.status(200).json({ 
      message: 'Stock data updated',
      stock: watchlist.stocks[stockIndex]
    });
  } catch (error) {
    console.error('Error updating stock data:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

module.exports = {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  updateStockData
};