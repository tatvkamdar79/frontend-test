import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import { login } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import useCookies from "../hooks/useCookies";

const Login = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const { setCookie, checkIsUserAuthenticatedAlready } = useCookies();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    try {
      const response = await login(username, password);
      if (response.success) {
        console.log("SUCCESS");
        setCookie("AUTHENTICATION", username, 1000);
        setUser({ isAuthenticated: true, userData: response.data });
        localStorage.setItem(
          "user",
          JSON.stringify({ isAuthenticated: true, userData: response.data })
        );
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    if (checkIsUserAuthenticatedAlready()) {
      setUser(JSON.parse(localStorage.getItem("user")));
    }
  }, []);

  return (
    <div className="flex justify-center place-items-center min-h-screen bg-gray-200">
      <div className="flex flex-col bg-white p-8 rounded shadow-lg w-full max-w-md">
        <div className="flex justify-between place-items-center mb-3">
          <h2 className="text-3xl font-semibold">Login</h2>
          <h2 className="text-3xl font-semibold">HH</h2>
        </div>
        <div className="h-0.5 w-full bg-gray-200 mb-3" />
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="username"
          >
            Username:
          </label>
          <input
            className="w-full border-2 border-gray-300 rounded py-2 px-3 leading-tight outline-none focus:border-cyan-300 transition-all duration-300"
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password:
          </label>
          <input
            className="w-full border-2 border-gray-300 rounded py-2 px-3 leading-tight outline-none focus:border-cyan-300 transition-all duration-300"
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
