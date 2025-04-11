import { useEffect, useRef } from "react";
import { useStockStore } from "../store/useStockStore";

const StockDetails = () => {
  const {
    selectedStock,
    stockDetails,
    isStockDetailsLoading,
    getStockDetails,
  } = useStockStore();

  const detailsEndRef = useRef(null);

  useEffect(() => {
    if (selectedStock && selectedStock.symbol) {
      getStockDetails(selectedStock.symbol);
    }
  }, [selectedStock, getStockDetails]);

  useEffect(() => {
    if (detailsEndRef.current) {
      detailsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [stockDetails]);

  if (isStockDetailsLoading) {
    return (
      <div className="flex-1 flex flex-col h-full">
        <div className="p-4 border-b bg-base-200 sticky top-0 z-10">
          <h2 className="text-2xl font-semibold text-base-content">
            Loading stock details...
          </h2>
        </div>
      </div>
    );
  }

  if (!selectedStock || !stockDetails) {
    return (
      <div className="flex-1 flex flex-col h-full">
        <div className="p-4 border-b bg-base-200 sticky top-0 z-10">
          <h2 className="text-2xl font-semibold text-base-content">
            No stock selected
          </h2>
        </div>
      </div>
    );
  }

  const stockData = stockDetails.data || [];
  if (stockData.length === 0) {
    return (
      <div className="flex-1 flex flex-col h-full">
        <div className="p-4 border-b bg-base-200 sticky top-0 z-10">
          <h2 className="text-2xl font-semibold text-base-content">
            {selectedStock.symbol}
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <p>No stock data available</p>
        </div>
      </div>
    );
  }

  const latest = stockData[0];
  const recent5 = stockData.slice(0, 5);

  const averageVolume = (
    recent5.reduce((sum, entry) => sum + (entry.volume || 0), 0) / recent5.length
  ).toFixed(2);
  const averageVWAP = (
    recent5.reduce((sum, entry) => sum + (entry.vwap || 0), 0) / recent5.length
  ).toFixed(2);
  const averageDeliverable = (
    recent5.reduce((sum, entry) => sum + (entry.percentDeliverable || 0), 0) /
    recent5.length
  ).toFixed(2);

  const highestHigh = Math.max(...recent5.map((entry) => entry.high || 0));
  const lowestLow = Math.min(...recent5.map((entry) => entry.low || 0));

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Sticky Header */}
      <div className="p-4 border-b bg-base-200 sticky top-0 z-10">
        <h2 className="text-2xl font-semibold text-base-content">
          {selectedStock.symbol}
        </h2>
      </div>

      {/* Scrollable Details */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-base-content">Latest Data</h3>
          <div><strong>Date:</strong> {new Date(latest.date).toLocaleDateString()}</div>
          <div><strong>Open:</strong> {latest.open}</div>
          <div><strong>Close:</strong> {latest.close}</div>
          <div><strong>High:</strong> {latest.high}</div>
          <div><strong>Low:</strong> {latest.low}</div>
          <div><strong>VWAP:</strong> {latest.vwap}</div>
          <div><strong>Volume:</strong> {latest.volume}</div>
          <div><strong>Turnover:</strong> {latest.turnover}</div>
          <div><strong>Trades:</strong> {latest.trades}</div>
          <div><strong>% Deliverable:</strong> {latest.percentDeliverable}%</div>
        </div>

        <hr className="my-4 border-gray-400" />

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-base-content">5-Day Summary</h3>
          <div><strong>Average Volume:</strong> {averageVolume}</div>
          <div><strong>Average VWAP:</strong> {averageVWAP}</div>
          <div><strong>Average % Deliverable:</strong> {averageDeliverable}%</div>
          <div><strong>Highest High:</strong> {highestHigh}</div>
          <div><strong>Lowest Low:</strong> {lowestLow}</div>
        </div>
        <div ref={detailsEndRef} />
      </div>
    </div>
  );
};

export default StockDetails;
