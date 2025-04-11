const express = require("express");
const {
  getAllStocks,
  getStockBySymbol,
  getStockInsights
} = require("../controllers/stock.controller");

const router = express.Router();

// Get all stock symbols (for left sidebar)
router.get("/", getAllStocks);

// Get data for a specific stock (for right side view)
router.get("/:symbol", getStockBySymbol);

// Get insights for a specific stock (ML model)
router.get("/:symbol/insights", getStockInsights);

module.exports = router;
