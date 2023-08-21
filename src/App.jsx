import React, { useState, useEffect } from "react";
import QRCodeScanner from "./components/QRCodeScanner";
import Searchbar from "./components/Searchbar";
import ItemList from "./components/ItemList";

const App = () => {
  const [openQRCodeScanner, setOpenQRCodeScanner] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    console.log("Products changed from app.jsx");
    console.log(products);
  }, [products]);
  return (
    <div className="h-screen bg-black overflow-y-scroll">
      <Searchbar setProducts={setProducts} />
      <ItemList products={products} />
      {/* <button onClick={() => setOpenQRCodeScanner(!openQRCodeScanner)}>
        {openQRCodeScanner ? "Close Scanner" : "Scan QR"}
      </button>
      {openQRCodeScanner && (
        <QRCodeScanner openQRCodeScanner={openQRCodeScanner} />
      )} */}
    </div>
  );
};

export default App;
