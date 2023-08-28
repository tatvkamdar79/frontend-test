import axios from "axios";
import { baseUrl } from "../utils/constants";

const companyAPI = "/company";

export const updateCompanyName = async (companyDetails) => {
  let company_id = companyDetails._id;
  if (company_id === undefined || company_id === null) {
    alert("Invalid Update");
    return false;
  }
  const url = `${baseUrl}${companyAPI}/updateCompanyName`;
  try {
    const response = await axios.post(url, companyDetails);
    return response.data;
  } catch (error) {
    alert(error.message);
    return error;
  }
};

export const deleteCompany = async (companyDetails) => {
  let company_id = companyDetails._id;
  if (company_id === undefined || company_id === null) {
    alert("Invalid Delete");
    return false;
  }
  const url = `${baseUrl}${companyAPI}/deleteCompany`;
  try {
    const response = await axios.post(url, companyDetails);
    console.log("response", response);
    return true;
  } catch (error) {
    alert(error.message);
    return error;
  }
};
