import axios from "axios";
import { baseUrl } from "./constants";

const productAPI = "/product";

export const search = async (searchQuery) => {
  searchQuery = searchQuery.trim();
  if (searchQuery.length <= 3) {
    return {
      data: null,
      errors: ["Minimum 3 letter search"],
    };
  }
  const url = `${baseUrl}${productAPI}/search?searchQuery=${searchQuery}`;
  try {
    const response = await axios.get(url);
    if (response.data.length === 0) {
      return {
        data: response.data,
        errors: [`No products found with the tag ${searchQuery}`],
      };
    }
    const dict = {};
    const unfilteredProducts = response.data;
    for (let i = 0; i < unfilteredProducts.length; i++) {
      let modelNumber = unfilteredProducts[i].modelNumber;

      if (dict.hasOwnProperty(modelNumber)) {
        dict[modelNumber].push(unfilteredProducts[i]);
      } else {
        dict[modelNumber] = [unfilteredProducts[i]];
      }
    }
    console.log("DATA LOADED FROM SEARCH FOR", searchQuery);
    return {
      data: dict,
      errors: [],
    };
  } catch (error) {
    console.log("ERROR", error);
    throw error;
  }
};
