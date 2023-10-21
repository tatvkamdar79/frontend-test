import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseUrl } from "../utils/constants";

const Settings = () => {
  const [fetchedUsers, setFetchedUsers] = useState([]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const getAllUsers = async () => {
    const response = await axios.get(`${baseUrl}/user/getAllUsers`);
    setFetchedUsers(response.data.data);
  };
  const deleteUser = async (index) => {
    try {
      const response = await axios.post(
        `${baseUrl}/user/deleteUser`,
        fetchedUsers[index]
      );
      console.log(response);
      alert(response.data.message);
      getAllUsers();
    } catch (error) {
      console.log(error);
      alert("Some Error Occured");
    }
  };
  useEffect(() => {
    getAllUsers();
  }, []);
  return (
    <div className="p-3">
      <section>
        <p className="text-2xl font-semibold text-gray-800 underline underline-offset-2">
          Settings
        </p>
      </section>
      <section className="ml-4">
        <p className="text-xl font-semibold text-gray-700 underline">Users</p>
        <button
          onClick={() => setShowAddUserModal(true)}
          className="px-2 py-1 bg-green-600 text-white font-semibold rounded-md my-2"
        >
          Add user
        </button>
        <ul className="ml-4">
          {fetchedUsers.length === 0 && <p>Loading...</p>}
          {fetchedUsers.map(({ username, password }, index) => (
            <div key={index} className="flex place-items-center gap-x-2">
              <p className="w-6 px-2 py-1 rounded-md text-center text-xl font-semibold">
                {index + 1}.
              </p>
              <p className="w-32 px-2 py-1 bg-gray-200 rounded-md">
                {username}
              </p>
              <p className="w-32 px-2 py-1 bg-gray-200 rounded-md">
                {password}
              </p>
              <button
                onClick={() => deleteUser(index)}
                className="w-28 px-2 py-1 text-white font-semibold bg-red-600 hover:bg-red-700 rounded-md transition-all"
              >
                Delete User
              </button>
            </div>
          ))}
        </ul>
      </section>
      <section></section>
      {showAddUserModal && (
        <AddUserModal setShowAddUserModal={setShowAddUserModal} />
      )}
    </div>
  );
};

export default Settings;

const AddUserModal = ({ setShowAddUserModal }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const addUser = async () => {
    try {
      const response = await axios.post(`${baseUrl}/user/addUser`, {
        username,
        password,
      });
      alert(response.data.message);
      setShowAddUserModal(false);
    } catch (error) {
      const message = error.response.data.message;
      alert(message);
    }
  };

  return (
    <div className="flex justify-center place-items-center absolute top-0 left-0 w-screen h-screen bg-gray-200 bg-opacity-50">
      <div className="flex flex-col gap-3 w-96 h-60 p-5 border-2 border-gray-600 rounded-md">
        <div>
          <p
            className={`font-semibold text-lg ${
              username === "" ? "text-red-500" : "text-green-600"
            }`}
          >
            Username :
          </p>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter Username"
            type="text"
            className="w-full p-2 outline-none border-2 rounded-md focus:border-cyan-400 transition-all"
          />
        </div>
        <div className="w-full">
          <p
            className={`font-semibold text-lg ${
              password === "" ? "text-red-500" : "text-green-600"
            }`}
          >
            Password :
          </p>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
            type="text"
            className="w-full p-2 outline-none border-2 rounded-md focus:border-cyan-400 transition-all"
          />
        </div>
        <div className="flex gap-x-6">
          <button
            onClick={addUser}
            className="px-2 py-1 bg-green-600 text-white font-semibold rounded-md place-self-end"
          >
            Add User
          </button>
          <button
            onClick={() => setShowAddUserModal(false)}
            className="px-2 py-1 bg-red-600 text-white font-semibold rounded-md place-self-end"
          >
            Discard
          </button>
        </div>
      </div>
    </div>
  );
};
