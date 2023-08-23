import React, { useState, useEffect, createContext } from "react";
import { Route, Routes } from "react-router-dom";
import useCookies from "./hooks/useCookies";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import POS from "./pages/POS";
import Product from "./pages/Product";
import Checkout from "./pages/Checkout";

export const UserContext = createContext();
export const CartContext = createContext();

const App = () => {
  const { checkIsUserAuthenticatedAlready } = useCookies();

  const [user, setUser] = useState({});
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchText, setSearchText] = useState("");

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
        <CartContext.Provider value={{ cart, setCart }}>
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
              </>
            ) : (
              <>
                <Route path="*" element={<Login />} />
              </>
            )}
          </Routes>
        </CartContext.Provider>
      </UserContext.Provider>
    </div>
  );
};

export default App;
