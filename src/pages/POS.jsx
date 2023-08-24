import React, { useContext, useState } from "react";
import Searchbar from "../components/Searchbar";
import QRCodeScanner from "../components/QRCodeScanner";
import ItemList from "../components/ItemList";
import CartComponent from "../components/CartComponent";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import { BsQrCodeScan } from "react-icons/bs";
import { IoBagCheckOutline } from "react-icons/io5";
import SideCart from "../components/SideCart";
import { ViewSideCartContext } from "../App";

const POS = ({ products, setProducts, searchText, setSearchText }) => {
  const [openQRCodeScanner, setOpenQRCodeScanner] = useState(false);
  const [loading, setLoading] = useState(false);
  const { viewSideCart, setViewSideCart } = useContext(ViewSideCartContext);

  return (
    <div className="w-screen h-screen bg-gray-100 p-6 overflow-y-scroll overflow-x-hidden">
      <div className="w-full md:max-w-screen-2xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Searchbar
            setProducts={setProducts}
            searchText={searchText}
            setSearchText={setSearchText}
            setLoading={setLoading}
          />
          <div className="w-full xs:w-5/6 mx-auto flex flex-col space-y-4 my-2 px-5">
            <div className="w-full flex justify-between place-items-center gap-x-2">
              <button
                className="w-[20%] flex justify-center place-items-center gap-x-2 px-4 py-2 xs:px-6 xs:py-3 rounded-md text-white bg-cyan-500 hover:bg-cyan-600 transition-all duration-300"
                onClick={() => setOpenQRCodeScanner(!openQRCodeScanner)}
              >
                <p className="font-semibold text-lg">
                  {openQRCodeScanner ? "Close Scanner" : "Scan QR"}
                </p>
                <BsQrCodeScan size={23} />
              </button>
              <div className="w-[50%]">
                <CartComponent />
              </div>
              {/* <Link
                to={"/pos/checkout"}
                className="w-[20%] flex justify-center gap-x-2 px-4 py-2 xs:px-6 xs:py-3 rounded-md text-white font-semibold text-center bg-green-500 hover:bg-amber-500 transition-all duration-200"
              >
                <p className="font-semibold text-lg">Checkout</p>
                <IoBagCheckOutline size={25} />
              </Link> */}
            </div>
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
              <Loader />
            </div>
          )}
          <ItemList products={products} />
        </div>
      </div>
      <SideCart />
    </div>
  );
};

export default POS;
