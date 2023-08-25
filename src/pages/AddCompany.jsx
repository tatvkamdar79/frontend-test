// AddCompany.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../utils/constants";
import CompanyModal from "../components/CompanyModal";

const AddCompany = () => {
  const [companyName, setCompanyName] = useState("");
  const [existingCompanies, setExistingCompanies] = useState([]);
  const [suggestedCompanies, setSuggestedCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const response = await axios.get(baseUrl + "/company/getAllCompanies");
        setExistingCompanies(response.data.data);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    }
    fetchCompanies();
  }, []);

  useEffect(() => {
    const suggestions = existingCompanies.filter(
      (company) =>
        company.companyName.toLowerCase().includes(companyName.toLowerCase()) ||
        company.companyName.toLowerCase() === companyName.toLowerCase()
    );
    setSuggestedCompanies(suggestions);
  }, [companyName, existingCompanies]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(baseUrl + "/company/addCompany", {
        companyName:
          companyName.trim().charAt(0).toUpperCase() +
          companyName.trim().slice(1),
      });
      setExistingCompanies([...existingCompanies, response.data.data]);
      setCompanyName("");
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const openModal = (company) => {
    setSelectedCompany(company);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedCompany(null);
    setShowModal(false);
  };

  return (
    <div className="min-h-screen flex flex-row">
      <div className="w-1/2 bg-gray-200 p-8">
        <h1 className="text-2xl font-semibold mb-4">Add Company</h1>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-medium">Company Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Company
          </button>
        </form>
      </div>
      <div className="w-1/2 bg-gray-100 p-8">
        <ul className="mb-4">
          {suggestedCompanies.length === 0 ? (
            <li className="text-2xl font-semibold text-gray-600">
              No companies match your search
            </li>
          ) : (
            suggestedCompanies.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => openModal(suggestion)}
                className="cursor-pointer text-blue-500 mb-2"
              >
                {suggestion?.companyName}
              </li>
            ))
          )}
        </ul>
      </div>
      {showModal && (
        <CompanyModal
          company={selectedCompany}
          onClose={closeModal}
          onDelete={() => {
            // Handle deletion here
            // You need to implement the deleteCompany function using Axios
            // and update the existingCompanies state after deletion
            closeModal();
          }}
          onEdit={() => {
            // Handle editing here
            // You need to implement the editCompany function using Axios
            // and update the existingCompanies state after editing
            closeModal();
          }}
        />
      )}
    </div>
  );
};

export default AddCompany;
