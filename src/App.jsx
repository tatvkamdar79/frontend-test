import React, { useState, useEffect, createContext } from "react";
import { Route, Routes } from "react-router-dom";
import useCookies from "./hooks/useCookies";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import POS from "./pages/POS";
import Product from "./pages/Product";
import Checkout from "./pages/Checkout";
import Inventory from "./pages/Inventory";
import Items from "./pages/Items";
import AddCompany from "./pages/AddCompany";
import ManageProducts from "./pages/ManageProducts";
import ProductDetails from "./pages/ProductDetails";
import Navbar from "./components/Navbar";

export const BreadCrumbsContext = createContext();
export const UserContext = createContext();
export const CartContext = createContext();
export const ViewSideCartContext = createContext();
export const GlobalDiscountContext = createContext();

const App = () => {
  const { checkIsUserAuthenticatedAlready } = useCookies();

  const [user, setUser] = useState({});
  const [products, setProducts] = useState([]);
  const [path, setPath] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [viewSideCart, setViewSideCart] = useState(false);
  const [globalDiscount, setGlobalDiscount] = useState(0);

  useEffect(() => {
    if (checkIsUserAuthenticatedAlready()) {
      console.log(localStorage.getItem("user"));
      setUser(JSON.parse(localStorage.getItem("user")));
    }
  }, []);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  return (
    <div>
      <UserContext.Provider value={{ user, setUser }}>
        <BreadCrumbsContext.Provider value={{ path, setPath }}>
          <CartContext.Provider value={{ cart, setCart }}>
            <ViewSideCartContext.Provider
              value={{ viewSideCart, setViewSideCart }}
            >
              <GlobalDiscountContext.Provider
                value={{ globalDiscount, setGlobalDiscount }}
              >
                <Navbar />
                <Routes>
                  {user && user?.isAuthenticated && user?.isAuthenticated ? (
                    // PLACE ALL PROTECTED ROUTES HERE
                    <>
                      <Route path="/" element={<Dashboard />} />
                      <Route
                        path="/pos"
                        element={
                          <POS
                            products={products}
                            setProducts={setProducts}
                            searchText={searchText}
                            setSearchText={setSearchText}
                          />
                        }
                      />
                      <Route path="/pos/:modelNumber" element={<Product />} />
                      <Route path="/pos/checkout" element={<Checkout />} />

                      <Route path="/inventory" element={<Inventory />} />
                      <Route path="/inventory/items" element={<Items />} />
                      <Route
                        path="/inventory/items/manage"
                        element={
                          <ManageProducts
                            products={products}
                            setProducts={setProducts}
                            searchText={searchText}
                            setSearchText={setSearchText}
                          />
                        }
                      />
                      <Route
                        path="/inventory/items/manage/:modelNumber"
                        element={
                          <ProductDetails
                            products={products}
                            setProducts={setProducts}
                            searchText={searchText}
                            setSearchText={setSearchText}
                          />
                        }
                      />
                      <Route
                        path="/inventory/add-company"
                        element={<AddCompany />}
                      />
                    </>
                  ) : (
                    <>
                      <Route path="*" element={<Login />} />
                    </>
                  )}
                </Routes>
              </GlobalDiscountContext.Provider>
            </ViewSideCartContext.Provider>
          </CartContext.Provider>
        </BreadCrumbsContext.Provider>
      </UserContext.Provider>
    </div>
  );
};

export default App;
