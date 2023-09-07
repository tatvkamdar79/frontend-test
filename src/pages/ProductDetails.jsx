import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const ProductDetails = () => {
  const { state } = useLocation();
  const { productVariants } = state;

  const [formData, setFormData] = useState(productVariants);
  const [isEditing, setIsEditing] = useState(false);

  // Extracting common data from the first variant
  const commonData = formData[0] ? formData[0] : null;

  const handleChange = (index, key, value) => {
    const updatedFormData = [...formData];
    updatedFormData[index].variant[key] = value;
    setFormData(updatedFormData);
  };

  const handleDelete = (index) => {
    const updatedFormData = [...formData];
    updatedFormData.splice(index, 1);
    setFormData(updatedFormData);
  };

  const handleCommonDataChange = (key, value) => {
    const updatedCommonData = { ...commonData, [key]: value };
    setFormData([updatedCommonData, ...formData.slice(1)]);
  };

  const handleSave = () => {
    console.log("Form data saved:", formData);
  };

  return (
    <div className="w-full min-h-screen bg-gray-200 p-8">
      <h1 className="text-2xl font-bold mb-4">Product Details</h1>

      <div className="mb-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Disable Editing" : "Enable Editing"}
        </button>
      </div>

      {/* Display and edit common data */}
      {commonData && <h2 className="text-xl font-bold mb-2">Common Data</h2>}
      {commonData && (
        <div className="mb-8 grid grid-cols-3 gap-x-6">
          {Object.entries(commonData).map(([key, value]) => {
            if (key === "variant") return;
            if (key === "_id") return;
            return (
              <div key={key} className="mb-4">
                <label className="block text-gray-700 font-bold mb-2 capitalize">
                  {key}
                </label>
                <input
                  type="text"
                  value={value}
                  readOnly={!isEditing}
                  onChange={(e) =>
                    isEditing && handleCommonDataChange(key, e.target.value)
                  }
                  className="border rounded px-3 py-2 w-full"
                />
              </div>
            );
          })}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Variant Type</th>
              {Object.keys(formData[0].variant).map((key) => (
                <th
                  key={key}
                  className="border border-gray-300 px-4 py-2 capitalize"
                >
                  {key}
                </th>
              ))}
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {formData.map((variant, index) => (
              <tr
                key={variant._id}
                className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="border border-gray-300 px-4 py-2">
                  {variant.variant.color}
                </td>
                {Object.values(variant.variant).map((value, i) => (
                  <td key={i} className="border border-gray-300 px-4 py-2">
                    <input
                      type="text"
                      value={value}
                      readOnly={!isEditing}
                      onChange={(e) =>
                        isEditing &&
                        handleChange(
                          index,
                          Object.keys(variant.variant)[i],
                          e.target.value
                        )
                      }
                      className="w-full text-center"
                    />
                  </td>
                ))}
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                    onClick={() => handleDelete(index)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
        onClick={handleSave}
      >
        Save
      </button>
    </div>
  );
};

export default ProductDetails;
