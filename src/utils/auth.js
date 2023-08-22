import axios from "axios";
import { baseUrl } from "./constants";

const userAPI = "/user";

export const login = async (username, password) => {
  const url = `${baseUrl}${userAPI}/login`;
  try {
    const response = await axios.post(url, { username, password });
    console.log(response);
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};
