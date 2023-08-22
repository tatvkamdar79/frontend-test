import React, { useState, useEffect, createContext } from "react";
import { Route, Routes } from "react-router-dom";
import useCookies from "./hooks/useCookies";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import POS from "./pages/POS";
import Product from "./pages/Product";

export const UserContext = createContext();

const App = () => {
  const { checkIsUserAuthenticatedAlready } = useCookies();

  const [user, setUser] = useState({});

  useEffect(() => {
    if (checkIsUserAuthenticatedAlready()) {
      console.log("APP");
      console.log(localStorage.getItem("user"));
      setUser(JSON.parse(localStorage.getItem("user")));
    }
  }, []);

  return (
    <div>
      <UserContext.Provider value={{ user, setUser }}>
        <Routes>
          {user && user?.isAuthenticated && user?.isAuthenticated ? (
            // PLACE ALL PROTECTED ROUTES HERE
            <>
              <Route path="/" element={<Dashboard />} />
              <Route path="/pos" element={<POS />} />
              <Route path="/pos/:modelNumber" element={<Product />} />
            </>
          ) : (
            <>
              <Route path="*" element={<Login />} />
            </>
          )}
        </Routes>
      </UserContext.Provider>
    </div>
  );
};

export default App;
