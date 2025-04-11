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
        <div className="p-4 border-b bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Loading stock details...
          </h2>
        </div>
      </div>
    );
  }

  if (!selectedStock || !stockDetails) {
    return (
      <div className="flex-1 flex flex-col h-full">
        <div className="p-4 border-b bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100">
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
        <div className="p-4 border-b bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100">
            {selectedStock.symbol}
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-gray-700 dark:text-gray-300">No stock data available</p>
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
      <div className="p-4 border-b bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100">
          {selectedStock.symbol}
        </h2>
      </div>

      {/* Scrollable Details */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-gray-800 dark:text-gray-200">
        <div className="space-y-2 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Latest Data</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div><strong className="text-gray-700 dark:text-gray-300">Date:</strong> {new Date(latest.date).toLocaleDateString()}</div>
            <div><strong className="text-gray-700 dark:text-gray-300">Open:</strong> {latest.open}</div>
            <div><strong className="text-gray-700 dark:text-gray-300">Close:</strong> {latest.close}</div>
            <div><strong className="text-gray-700 dark:text-gray-300">High:</strong> {latest.high}</div>
            <div><strong className="text-gray-700 dark:text-gray-300">Low:</strong> {latest.low}</div>
            <div><strong className="text-gray-700 dark:text-gray-300">VWAP:</strong> {latest.vwap}</div>
            <div><strong className="text-gray-700 dark:text-gray-300">Volume:</strong> {latest.volume}</div>
            <div><strong className="text-gray-700 dark:text-gray-300">Turnover:</strong> {latest.turnover}</div>
            <div><strong className="text-gray-700 dark:text-gray-300">Trades:</strong> {latest.trades}</div>
            <div><strong className="text-gray-700 dark:text-gray-300">% Deliverable:</strong> {latest.percentDeliverable}%</div>
          </div>
        </div>

        <hr className="my-4 border-gray-300 dark:border-gray-700" />

        <div className="space-y-2 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">5-Day Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div><strong className="text-gray-700 dark:text-gray-300">Average Volume:</strong> {averageVolume}</div>
            <div><strong className="text-gray-700 dark:text-gray-300">Average VWAP:</strong> {averageVWAP}</div>
            <div><strong className="text-gray-700 dark:text-gray-300">Average % Deliverable:</strong> {averageDeliverable}%</div>
            <div><strong className="text-gray-700 dark:text-gray-300">Highest High:</strong> {highestHigh}</div>
            <div><strong className="text-gray-700 dark:text-gray-300">Lowest Low:</strong> {lowestLow}</div>
          </div>
        </div>
        <div ref={detailsEndRef} />
      </div>
    </div>
  );
};

export default StockDetails;