// models/Watchlist.js
const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  stocks: [
    {
      symbol: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, default: 0 },
      change: { type: Number, default: 0 },
      lastUpdated: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Watchlist', watchlistSchema);