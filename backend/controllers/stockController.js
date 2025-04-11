const Stock = require("../models/Stock.js");

// Get all stock symbols (just name and maybe _id)
const getAllStocks = async (req, res) => {
    try {
      const stocks = await Stock.find({}, "symbol data");
  
      const processed = stocks.map(stock => {
        const latestData = stock.data?.[stock.data.length - 1];
        return {
          symbol: stock.symbol,
          lastClose: latestData?.close ?? null,
        };
      });
  
      res.status(200).json(processed);
    } catch (error) {
      res.status(500).json({ message: "Error fetching stocks", error });
    }
  };
  

// Get full data of a single stock by symbol
const getStockBySymbol = async (req, res) => {
  try {
    const stock = await Stock.findOne({ symbol: req.params.symbol });
    if (!stock) return res.status(404).json({ message: "Stock not found" });
    res.status(200).json(stock);
  } catch (error) {
    res.status(500).json({ message: "Error fetching stock", error });
  }
};

// Get ML-based insights (placeholder for now)
const getStockInsights = async (req, res) => {
  try {
    const symbol = req.params.symbol;
    // Run or call your ML model here. Placeholder for now.
    res.status(200).json({
      symbol,
      insight: "This stock is showing strong upward momentum based on 7-day average volume."
    });
  } catch (error) {
    res.status(500).json({ message: "Error generating insights", error });
  }
};

module.exports = {
  getAllStocks,
  getStockBySymbol,
  getStockInsights
};
