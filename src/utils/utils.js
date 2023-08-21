import axios from "axios";

export const baseUrl = "http://localhost:8080";
export const baseProductAPI = "/product"; // Removed baseUrl from here

export const search = async (searchQuery) => {
  searchQuery = searchQuery.trim();
  if (searchQuery.length <= 3) {
    return {
      data: null,
      errors: ["Minimum 3 letter search"],
    };
  }
  const url = `${baseUrl}${baseProductAPI}/search?searchQuery=${searchQuery}`;
  try {
    const response = await axios.get(url);
    return {
      data: response.data,
      errors: [],
    };
  } catch (error) {
    console.log("ERROR", error);
    throw error;
  }
};
