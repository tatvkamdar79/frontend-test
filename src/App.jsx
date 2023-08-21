import React, { useState, useEffect } from "react";
import QRCodeScanner from "./components/QRCodeScanner";
import Searchbar from "./components/Searchbar";
import ItemList from "./components/ItemList";

const App = () => {
  const [openQRCodeScanner, setOpenQRCodeScanner] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("Products changed from app.jsx");
    // console.log(products);
  }, [products]);
  return (
    <div className="h-screen bg-black overflow-y-scroll">
      <Searchbar
        setProducts={setProducts}
        searchText={searchText}
        setSearchText={setSearchText}
        setLoading={setLoading}
      />
      <div className="flex flex-col mb-10 justify-center place-items-center">
        <button
          className="px-4 py-2 border-2 border-cyan-500 rounded-md bg-gray-600 text-white"
          onClick={() => setOpenQRCodeScanner(!openQRCodeScanner)}
        >
          {openQRCodeScanner ? "Close Scanner" : "Scan QR"}
        </button>
        {openQRCodeScanner && (
          <QRCodeScanner
            openQRCodeScanner={openQRCodeScanner}
            setOpenQRCodeScanner={setOpenQRCodeScanner}
            setProducts={setProducts}
            setSearchText={setSearchText}
            setLoading={setLoading}
          />
        )}
      </div>
      {loading && (
        <div className="w-full mx-auto flex justify-center place-items-center">
          <img
            src={
              "https://i.pinimg.com/originals/8a/1e/31/8a1e31b5d577f9da0b8c30c7364d004a.gif"
            }
            alt={"Loading..."}
            className="h-40 animate-pulse"
          />
          <img
            src={
              "https://i.pinimg.com/originals/8a/1e/31/8a1e31b5d577f9da0b8c30c7364d004a.gif"
            }
            alt={"Loading..."}
            className="h-40 animate-pulse rotate-180"
          />
        </div>
      )}
      <ItemList products={products} />
      <div className="w-full mx-auto flex flex-col justify-center place-items-center"></div>
    </div>
  );
};

export default App;
