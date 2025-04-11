// HomePage.jsx
import { useStockStore } from "../store/useStockStore";
import StockSidebar from "../components/StockSidebar";
import NoStockSelected from "../components/NoStockSelected";
import StockDetails from "../components/StockDetails";

const HomePage = () => {
  const { selectedStock } = useStockStore();

  return (
    <div className="h-full w-full flex flex-col bg-base-200">
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <StockSidebar />
        <div className="flex-1 overflow-hidden">
          {!selectedStock ? <NoStockSelected /> : <StockDetails />}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
