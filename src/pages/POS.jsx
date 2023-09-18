import React, { useContext, useEffect, useState } from "react";
import Searchbar from "../components/Searchbar";
import QRCodeScanner from "../components/QRCodeScanner";
import ItemList from "../components/ItemList";
import CartComponent from "../components/CartComponent";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import { BsQrCodeScan } from "react-icons/bs";
import { IoBagCheckOutline } from "react-icons/io5";
import SideCart from "../components/SideCart";
import { BreadCrumbsContext, ViewSideCartContext } from "../App";

const POS = ({ products, setProducts, searchText, setSearchText }) => {
  const { path, setPath } = useContext(BreadCrumbsContext);
  const [openQRCodeScanner, setOpenQRCodeScanner] = useState(false);
  const [loading, setLoading] = useState(false);
  const { viewSideCart, setViewSideCart } = useContext(ViewSideCartContext);

  useEffect(() => {
    const currentPath = [...path];
    currentPath.push({
      page: "POS",
      history: ["base", "POS"],
      element: <Link to={"/pos"}>POS</Link>,
    });
    setPath(currentPath);
    return () => {
      const leavingPath = [...path];
      leavingPath.filter((pages) => pages.page !== "POS");
      setPath(leavingPath);
    };
  }, []);
  return (
    <div className="w-screen h-[94vh] p-4 bg-gray-100 overflow-y-scroll overflow-x-hidden">
      <div className="w-full md:max-w-screen-2xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <section className="w-[92%] mx-auto flex place-items-center gap-x-2 p-2">
            <div className="w-3/4 lg:w-2/3">
              <Searchbar
                setProducts={setProducts}
                searchText={searchText}
                setSearchText={setSearchText}
                setLoading={setLoading}
              />
            </div>
            <div className="w-1/4 lg:w-1/3 mx-auto flex flex-col transition-all duration-300">
              <div className="w-full flex justify-between place-items-center gap-x-2">
                <button
                  className="w-full flex justify-center place-items-center gap-x-2 px-4 py-3 rounded-md text-white bg-gray-500 hover:bg-gray-600 transition-all duration-300"
                  onClick={() => setOpenQRCodeScanner(!openQRCodeScanner)}
                >
                  <p className="font-semibold text-lg">
                    {openQRCodeScanner ? "Close Scanner" : "Scan QR"}
                  </p>
                  <BsQrCodeScan size={23} />
                </button>
              </div>
            </div>
          </section>
          <section className="w-[92%] mx-auto flex justify-between place-items-center gap-x-2 p-2">
            <div className="w-3/4 lg:w-2/3">
              <CartComponent />
            </div>
            {/* mx-auto flex flex-col" */}
            <Link
              to={"/pos/checkout"}
              className="w-1/4 lg:w-1/3 flex justify-center place-items-center gap-x-2 px-4 py-3 rounded-md text-white bg-gray-500 hover:bg-gray-600 transition-all duration-300"
            >
              <p className="font-semibold text-lg">Checkout</p>
              <IoBagCheckOutline size={25} />
            </Link>
            {openQRCodeScanner && (
              <QRCodeScanner
                openQRCodeScanner={openQRCodeScanner}
                setOpenQRCodeScanner={setOpenQRCodeScanner}
                setProducts={setProducts}
                setSearchText={setSearchText}
                setLoading={setLoading}
              />
            )}
          </section>
          <div className="w-[92%] mx-auto h-0.5 bg-gray-400 my-2" />
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
