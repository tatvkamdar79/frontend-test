// CompanyModal.js
import React, { useState } from "react";
import PropTypes from "prop-types";
import { deleteCompany, updateCompanyName } from "../utils/companyUtils";

const CompanyModal = ({ company, onClose, onDelete, onEdit }) => {
  const [editedCompanyName, setEditedCompanyName] = useState(
    company?.companyName || ""
  );
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    const response = await updateCompanyName({
      ...company,
      companyName: editedCompanyName,
    });
    // console.log(response);
    setIsEditing(false);
    onEdit();
  };

  const handleDelete = async () => {
    const response = await deleteCompany(company);
    // console.log(response);
    setIsEditing(false);
    onDelete();
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-8 rounded shadow-md">
        {company && (
          <>
            <h2 className="text-xl font-semibold mb-4">
              {company.companyName}
            </h2>
            <div className="mb-4">
              <label className="block font-medium">_id</label>
              <input
                type="text"
                value={company._id}
                className="w-full p-2 border rounded"
                readOnly
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium">Company Name</label>
              <input
                type="text"
                value={editedCompanyName}
                onChange={(e) => setEditedCompanyName(e.target.value)}
                className={`w-full p-2 border rounded ${
                  isEditing ? "" : "cursor-not-allowed"
                }`}
                readOnly={!isEditing}
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium">Company ID</label>
              <input
                type="text"
                value={company.companyId}
                className="w-full p-2 border rounded"
                readOnly
              />
            </div>
            <div className="flex space-x-4 mt-4">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit
                </button>
              )}
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

CompanyModal.propTypes = {
  company: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default CompanyModal;
