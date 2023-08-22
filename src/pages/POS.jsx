import React, { useState } from "react";
import Searchbar from "../components/Searchbar";
import QRCodeScanner from "../components/QRCodeScanner";
import ItemList from "../components/ItemList";

const POS = ({ products, setProducts, searchText, setSearchText }) => {
  const [openQRCodeScanner, setOpenQRCodeScanner] = useState(false);
  // const [products, setProducts] = useState([]);
  // const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="h-screen bg-gray-100 p-6">
      <div className="max-w-screen-xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Searchbar
            setProducts={setProducts}
            searchText={searchText}
            setSearchText={setSearchText}
            setLoading={setLoading}
          />
          <div className="w-5/6 mx-auto flex flex-col space-y-4 my-2 px-5">
            <button
              className="px-6 py-3 border border-teal-500 rounded-md bg-cyan-500 text-white hover:bg-cyan-600 transition-all duration-300"
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
            <div className="flex justify-center mt-6">
              <img
                src="https://i.pinimg.com/originals/8a/1e/31/8a1e31b5d577f9da0b8c30c7364d004a.gif"
                alt="Loading..."
                className="h-20 animate-pulse"
              />
            </div>
          )}
          <ItemList products={products} />
        </div>
      </div>
    </div>
  );
};

export default POS;
