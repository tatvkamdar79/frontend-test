import React, { useState } from "react";

const AddItem = () => {
  const [showForm, setShowForm] = useState(false);
  const [drafts, setDrafts] = useState([]);
  const [formData, setFormData] = useState({
    productTitle: "",
    productCode: "",
    productType: "",
    modelNumber: "",
    description: "",
  });

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const editDraft = (index) => {
    // Get the draft data at the specified index
    const draftToEdit = drafts[index];

    // Populate the form with the draft data
    setFormData({
      productTitle: draftToEdit.productTitle,
      productCode: draftToEdit.productCode,
      productType: draftToEdit.productType,
      modelNumber: draftToEdit.modelNumber,
      description: draftToEdit.description,
    });

    // Show the form
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic form validation
    if (
      formData.productTitle &&
      formData.productCode &&
      formData.productType &&
      formData.modelNumber &&
      formData.description
    ) {
      // Handle form submission and saving to drafts or database
      // Example: You can add the form data to the drafts array
      setDrafts([...drafts, formData]);
      setFormData({
        productTitle: "",
        productCode: "",
        productType: "",
        modelNumber: "",
        description: "",
      });
      setShowForm(false);
    } else {
      alert("Please fill in all required fields.");
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={toggleForm}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
      >
        Add Item
      </button>
      {showForm && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Add Item</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="productTitle"
                placeholder="Product Title"
                className="w-full border p-2 rounded-md mb-2"
                value={formData.productTitle}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="productCode"
                placeholder="Product Code"
                className="w-full border p-2 rounded-md mb-2"
                value={formData.productCode}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="productType"
                placeholder="Product Type"
                className="w-full border p-2 rounded-md mb-2"
                value={formData.productType}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="modelNumber"
                placeholder="Model Number"
                className="w-full border p-2 rounded-md mb-2"
                value={formData.modelNumber}
                onChange={handleInputChange}
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                className="w-full border p-2 rounded-md mb-2"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2"
                >
                  Save Draft
                </button>
                <button
                  type="button"
                  onClick={toggleForm}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="mt-8 grid grid-cols-3 gap-4">
        {drafts.map((draft, index) => (
          <div
            key={index}
            className="bg-gray-100 p-4 rounded-lg shadow-md flex flex-col justify-between"
          >
            <p className="text-gray-500 mb-2">Draft {index + 1}</p>
            <div className="flex justify-end">
              {/* Display draft details */}
              <button
                className="bg-blue-500 text-white px-2 py-1 rounded"
                onClick={() => editDraft(index)}
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddItem;
