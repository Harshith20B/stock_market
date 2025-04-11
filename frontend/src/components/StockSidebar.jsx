import { useEffect, useState } from "react";
import { useStockStore } from "../store/useStockStore";
import { Plus, Minus } from "lucide-react";

const StockSidebar = () => {
    const {
        getStocks,
        filteredStocks,
        setSelectedStock,
        selectedStock,
        searchQuery,
        setSearchQuery,
    } = useStockStore();

    const [watchlist, setWatchlist] = useState([]);

    useEffect(() => {
        getStocks();
    }, []);

    const toggleWatchlist = (symbol) => {
        setWatchlist((prev) =>
            prev.includes(symbol)
                ? prev.filter((s) => s !== symbol)
                : [...prev, symbol]
        );
    };

    const visibleStocks = filteredStocks();

    return (
        <div className="w-80 bg-white dark:bg-gray-900 shadow-lg h-full overflow-y-auto border-r dark:border-gray-800 p-4">
            <input
                type="text"
                placeholder="Search stocks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full mb-4 p-2 rounded border dark:bg-gray-800 dark:text-white"
            />

            <ul className="space-y-2">
                {visibleStocks.map((stock) => (
                    <li
                        key={stock.symbol}
                        onClick={() => {
                            if (selectedStock?.symbol === stock.symbol) {
                                setSelectedStock(null); // Deselect if same stock clicked
                            } else {
                                setSelectedStock(stock); // Select new stock
                            }
                        }}

                        className={`cursor-pointer px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${selectedStock?.symbol === stock.symbol
                                ? "bg-blue-100 dark:bg-blue-800 text-blue-900 dark:text-white"
                                : ""
                            }`}
                    >
                        <div className="flex justify-between items-center">
                            <div>
                            <p className="font-medium dark:text-white">{stock.symbol}</p>
                            </div>

                            <div className="flex flex-col items-end">
                                <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                                    ₹{stock.lastClose ?? "N/A"}
                                </p>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleWatchlist(stock.symbol);
                                    }}
                                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mt-1"
                                >
                                    {watchlist.includes(stock.symbol) ? (
                                        <>
                                            <Minus className="w-3 h-3" /> Remove
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-3 h-3" /> Watch
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default StockSidebar;
