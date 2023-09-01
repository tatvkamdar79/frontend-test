import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseUrl } from "../utils/constants";
import { RiDeleteBin5Fill } from "react-icons/ri";
import EndLine from "./EndLine";
import { MdClose } from "react-icons/md";
import { addProduct } from "../utils/productUtils";

const AddItemModal = ({
  setOpenAddItemModal,
  draftItems,
  setDraftItems,
  draftDetails,
  setDraftDetails,
  selectedDraftName,
  setSelectedDraftName,
}) => {
  const [companies, setCompanies] = useState([]);
  const [draftName, setDraftName] = useState("");
  const [variants, setVariants] = useState([]);
  const [isSizeVariant, setIsSizeVariant] = useState(false);
  const [isColorVariant, setIsColorVariant] = useState(false);
  const [isMaterialVariant, setIsMaterialVariant] = useState(false);
  const [isStyleVariant, setIsStyleVariant] = useState(false);
  const [variantFormat, setVariantFormat] = useState({});

  const [formData, setFormData] = useState({
    company: "",
    productCode: "",
    productTitle: "",
    productType: "",
    modelNumber: "",
    productCategory: "",
    hsn: "",
    additionalIdentifier: "",
    additionalIdentifier2: "",
    description: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    for (let field in formData) {
      if (
        field === "hsn" ||
        field === "additionalIdentifier" ||
        field === "additionalIdentifier2" ||
        field === "description"
      ) {
        continue;
      }
      if (!formData[field] || formData[field] === "") {
        alert("Please fill all the fields");
        return;
      }
    }
    let response = await addProduct(formData, variants);
    if (response && response.success) {
      alert(response.message);
      deleteItemFromDraft();
      closeProcedure();
      setOpenAddItemModal(false);
    }
  };

  const deleteItemFromDraft = () => {
    let newDraftItems = { ...draftItems };
    delete newDraftItems[selectedDraftName];
    setDraftItems(newDraftItems);
    localStorage.setItem("draftItems", newDraftItems);
  };

  const deleteVariantRow = (e, index) => {
    e.preventDefault();
    const draftVariants = [...variants];
    draftVariants.splice(index, 1);
    if (draftVariants.length === 0) {
      setVariants([]);
    } else {
      setVariants(draftVariants);
    }
  };

  const addNewRowToVariants = () => {
    if (
      !isSizeVariant &&
      !isColorVariant &&
      !isMaterialVariant &&
      !isStyleVariant
    ) {
      alert("Please select variant fields!");
      return;
    }
    // let draftVariants = [...variants];
    let newVariantRow = {};
    let variantFields = Object.keys(variantFormat);
    for (let variantField of variantFields) {
      newVariantRow[variantField] = "";
    }
    newVariantRow["mrp"] = 0;
    newVariantRow["cost"] = 0;
    setVariants([...variants, newVariantRow]);
  };
  useEffect(() => {
    let draftVariantFormat = {};
    if (isSizeVariant) {
      draftVariantFormat["size"] = "";
    } else {
      delete draftVariantFormat["size"];
    }
    if (isColorVariant) {
      draftVariantFormat["color"] = "";
    } else {
      delete draftVariantFormat["color"];
    }
    if (isMaterialVariant) {
      draftVariantFormat["material"] = "";
    } else {
      delete draftVariantFormat["material"];
    }
    if (isStyleVariant) {
      draftVariantFormat["style"] = "";
    } else {
      delete draftVariantFormat["style"];
    }
    setVariantFormat(draftVariantFormat);
  }, [isSizeVariant, isColorVariant, isMaterialVariant, isStyleVariant]);

  useEffect(() => {
    let variantFields = Object.keys(variantFormat);
    let draftVariants = [...variants];
    // console.log("HAHALOL", variants);
    for (let variant of draftVariants) {
      for (let variantField of variantFields) {
        if (!variant.hasOwnProperty(variantField)) {
          variant[variantField] = "";
        }
      }
    }
    // console.log("HAHALOL 2", draftVariants);

    for (let variant of draftVariants) {
      if (!isSizeVariant) {
        delete variant["size"];
      }
      if (!isColorVariant) {
        delete variant["color"];
      }
      if (!isMaterialVariant) {
        delete variant["material"];
      }
      if (!isStyleVariant) {
        delete variant["style"];
      }
    }
    setVariants(draftVariants);
  }, [variantFormat]);

  useEffect(() => {
    // console.log("VARIANTS CHANGED", variants);
  }, [variants]);
  const saveItemAsDraft = () => {
    let newDraftItems = { ...draftItems };
    let currentDraftName = draftName;
    if (draftName === "") {
      for (let i = 1; i < 1000; i++) {
        let checkDraftName = `Draft ${i}`;
        if (newDraftItems.hasOwnProperty(checkDraftName)) {
          continue;
        } else {
          currentDraftName = checkDraftName;
          break;
        }
      }
    }
    // console.log(variants);

    newDraftItems[currentDraftName] = {
      company: formData.company,
      productCode: formData.productCode,
      productTitle: formData.productTitle,
      productType: formData.productType,
      modelNumber: formData.modelNumber,
      productCategory: formData.productCategory,
      hsn: formData.hsn,
      additionalIdentifier: formData.additionalIdentifier,
      additionalIdentifier2: formData.additionalIdentifier2,
      description: formData.description,
      variants: [...variants],
    };

    if (selectedDraftName && selectedDraftName !== currentDraftName) {
      delete newDraftItems[selectedDraftName];
    }
    console.log(newDraftItems);
    setDraftItems(newDraftItems);
    localStorage.setItem("draftItems", JSON.stringify(newDraftItems));
    closeProcedure();
    setOpenAddItemModal(false);
  };

  async function fetchCompanies() {
    try {
      const response = await axios.get(baseUrl + "/company/getAllCompanies");
      const fetchedCompanies = response.data.data;
      fetchedCompanies.sort((a, b) =>
        a.companyName.localeCompare(b.companyName)
      );
      setCompanies(fetchedCompanies);
      //   console.log(fetchedCompanies);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  }
  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (localStorage.getItem("draftItems") === undefined) {
      localStorage.setItem("draftItems", JSON.stringify(draftItems));
    } else {
      setDraftItems(JSON.parse(localStorage.getItem("draftItems")));
    }
  }, []);

  useEffect(() => {
    console.log("draftDetails", draftDetails);
    // console.log(selectedDraftName);

    if (draftDetails) {
      setFormData({
        company: draftDetails.company,
        productCode: draftDetails.productCode,
        productTitle: draftDetails.productTitle,
        productType: draftDetails.productType,
        modelNumber: draftDetails.modelNumber,
        productCategory: draftDetails.productCategory,
        hsn: draftDetails.hsn,
        additionalIdentifier: draftDetails.additionalIdentifier,
        additionalIdentifier2: draftDetails.additionalIdentifier2,
        description: draftDetails.description,
      });
      setDraftName(selectedDraftName);
      if (draftDetails.variants && draftDetails.variants.length !== 0) {
        let fields = Object.keys(draftDetails.variants[0]);
        let tempVariantFormat = {};
        for (let field of fields) {
          if (field !== "mrp" || field !== "cost") {
            if (field === "size") {
              tempVariantFormat["size"] = "";
              setIsSizeVariant(true);
            }
            if (field === "color") {
              tempVariantFormat["color"] = "";
              setIsColorVariant(true);
            }
            if (field === "material") {
              tempVariantFormat["material"] = "";
              setIsMaterialVariant(true);
            }
            if (field === "style") {
              tempVariantFormat["style"] = "";
              setIsStyleVariant(true);
            }
          }
        }
        setVariantFormat(tempVariantFormat);
        setVariants(draftDetails.variants);
      }
    }
  }, []);

  const closeProcedure = () => {
    console.log("Close Procedure Called");
    setDraftDetails(null);
    setSelectedDraftName(null);
    setIsSizeVariant(false);
    setIsColorVariant(false);
    setIsMaterialVariant(false);
    setIsStyleVariant(false);
    setVariantFormat({});
    setVariants([]);
    setDraftName("");
    setFormData({
      company: "",
      productCode: "",
      productTitle: "",
      productType: "",
      modelNumber: "",
      productCategory: "",
      hsn: "",
      additionalIdentifier: "",
      additionalIdentifier2: "",
      description: "",
    });
  };

  return (
    <div className="w-5/6 mx-auto bg-white p-5 rounded-lg shadow-lg shadow-gray-400 border-2 border-blue-300">
      <div>
        <div className="flex justify-between">
          <p className="text-xl font-semibold mb-4">Add Item</p>
          <MdClose
            size={35}
            onClick={() => {
              closeProcedure();
              setOpenAddItemModal(false);
            }}
            className="text-red-600 cursor-pointer"
          />
        </div>
        <input
          type="text"
          value={draftName}
          onChange={(e) => setDraftName(e.target.value)}
          placeholder="Set A Draft Name"
          className="w-64 px-3 py-2 outline-none border-2 border-gray-400 rounded-md focus:border-green-500 transition-all duration-300 ease-in-out capitalize"
        />
      </div>
      <div className="space-y-4">
        <section id="top" className="flex justify-between place-items-center">
          <section className="w-5/12">
            <div className="h-24 flex flex-col justify-center">
              <label className="block font-semibold mb-1">Company:</label>
              <select
                className="w-40 border-2 rounded-md px-2 py-1 font-semibold text-gray-700 outline-none focus:border-gray-400 transition-all duration-200"
                defaultValue={formData.company ? formData.company : "none"}
                name="companies"
                id="companies"
                onChange={(e) => handleInputChange("company", e.target.value)}
              >
                <option value="none" disabled>
                  Select Company
                </option>
                {companies.map((company) => (
                  <option key={company._id} value={company.companyName}>
                    {company.companyName}
                  </option>
                ))}
              </select>
            </div>
            <EndLine />
            <div className="h-24 flex flex-col justify-center">
              <label className="block font-semibold mb-1">Product Code:</label>
              <input
                type="text"
                value={formData.productCode}
                onChange={(e) =>
                  handleInputChange("productCode", e.target.value)
                }
                className="border rounded p-2 w-full"
              />
            </div>
            <EndLine />
            <div className="h-24 flex flex-col justify-center">
              <label className="block font-semibold mb-1">Product Title:</label>
              <input
                type="text"
                value={formData.productTitle}
                onChange={(e) =>
                  handleInputChange("productTitle", e.target.value)
                }
                className="border rounded p-2 w-full"
              />
            </div>
            <EndLine />
          </section>
          <section className="w-5/12">
            <div className="h-24 flex flex-col justify-center">
              <label className="block font-semibold mb-1">Product Type:</label>
              <input
                type="text"
                value={formData.productType}
                onChange={(e) =>
                  handleInputChange("productType", e.target.value)
                }
                className="border rounded p-2 w-full"
              />
            </div>
            <EndLine />
            <div className="h-24 flex flex-col justify-center">
              <label className="block font-semibold mb-1">Model Number:</label>
              <input
                type="text"
                value={formData.modelNumber}
                onChange={(e) =>
                  handleInputChange("modelNumber", e.target.value)
                }
                className="border rounded p-2 w-full"
              />
            </div>
            <EndLine />
            <div className="h-24 flex flex-col justify-center">
              <label className="block font-semibold mb-1">
                Product Category:
              </label>
              <input
                type="text"
                value={formData.productCategory}
                onChange={(e) =>
                  handleInputChange("productCategory", e.target.value)
                }
                className="border rounded p-2 w-full"
              />
            </div>
            <EndLine />
          </section>
        </section>
        <section className="w-full">
          <section className="w-full flex justify-between place-items-center">
            <label className="block font-semibold mb-1 underline">
              Variants
            </label>
            <div className="flex gap-x-3 font-semibold my-3">
              <button
                onClick={() => setIsSizeVariant((prevState) => !prevState)}
                className={`flex gap-x-1 border px-2 py-1 rounded-md hover:scale-105 transition-all ${
                  isSizeVariant && "bg-green-400"
                }`}
              >
                <p htmlFor="size">Size</p>
              </button>
              <button
                onClick={() => setIsColorVariant((prevState) => !prevState)}
                className={`flex gap-x-1 border px-2 py-1 rounded-md hover:scale-105 transition-all ${
                  isColorVariant && "bg-green-400"
                }`}
              >
                <p htmlFor="color">Color</p>
              </button>
              <button
                onClick={() => setIsMaterialVariant((prevState) => !prevState)}
                className={`flex gap-x-1 border px-2 py-1 rounded-md hover:scale-105 transition-all ${
                  isMaterialVariant && "bg-green-400"
                }`}
              >
                <p htmlFor="material">Material</p>
              </button>
              <button
                onClick={() => setIsStyleVariant((prevState) => !prevState)}
                className={`flex gap-x-1 border px-2 py-1 rounded-md hover:scale-105 transition-all ${
                  isStyleVariant && "bg-green-400"
                }`}
              >
                <p htmlFor="style">Style</p>
              </button>
            </div>
            <div>
              <button
                onClick={addNewRowToVariants}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Add variant
              </button>
            </div>
          </section>
          <EndLine />
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                {isSizeVariant && <th className="py-2 px-4 border">Size</th>}
                {isColorVariant && <th className="py-2 px-4 border">Color</th>}
                {isMaterialVariant && (
                  <th className="py-2 px-4 border">Material</th>
                )}
                {isStyleVariant && <th className="py-2 px-4 border">Style</th>}
                {(isSizeVariant ||
                  isColorVariant ||
                  isMaterialVariant ||
                  isStyleVariant) && (
                  <>
                    <th className="py-2 px-4 border">MRP</th>
                    <th className="py-2 px-4 border">Cost</th>
                    <th className="py-2 px-4 border">Delete</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {variants.map((variant, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {isSizeVariant && (
                    <td className="py-2 px-4 border">
                      <input
                        type="text"
                        value={variant?.size}
                        onChange={(e) => {
                          let draftVariants = [...variants];
                          draftVariants[index].size = e.target.value;
                          setVariants(draftVariants);
                        }}
                        className="w-full px-3 py-2 outline-none border-2 border-gray-400 rounded-md focus:border-green-500 transition-all duration-300 ease-in-out capitalize"
                        placeholder="Enter size variant"
                      />
                    </td>
                  )}
                  {isColorVariant && (
                    <td className="py-2 px-4 border">
                      <input
                        type="text"
                        value={variant?.color}
                        onChange={(e) => {
                          let draftVariants = [...variants];
                          draftVariants[index].color = e.target.value;
                          setVariants(draftVariants);
                        }}
                        className="w-full px-3 py-2 outline-none border-2 border-gray-400 rounded-md focus:border-green-500 transition-all duration-300 ease-in-out capitalize"
                        placeholder="Enter color variant"
                      />
                    </td>
                  )}
                  {isMaterialVariant && (
                    <td className="py-2 px-4 border">
                      <input
                        type="text"
                        value={variant?.material}
                        onChange={(e) => {
                          let draftVariants = [...variants];
                          draftVariants[index].material = e.target.value;
                          setVariants(draftVariants);
                        }}
                        className="w-full px-3 py-2 outline-none border-2 border-gray-400 rounded-md focus:border-green-500 transition-all duration-300 ease-in-out capitalize"
                        placeholder="Enter material variant"
                      />
                    </td>
                  )}
                  {isStyleVariant && (
                    <td className="py-2 px-4 border">
                      <input
                        type="text"
                        value={variant?.style}
                        onChange={(e) => {
                          let draftVariants = [...variants];
                          draftVariants[index].style = e.target.value;
                          setVariants(draftVariants);
                        }}
                        className="w-full px-3 py-2 outline-none border-2 border-gray-400 rounded-md focus:border-green-500 transition-all duration-300 ease-in-out capitalize"
                        placeholder="Enter style variant"
                      />
                    </td>
                  )}
                  {(isSizeVariant ||
                    isColorVariant ||
                    isMaterialVariant ||
                    isStyleVariant) && (
                    <>
                      <td className="py-2 px-4 border">
                        <input
                          type="number"
                          value={variant?.mrp}
                          onChange={(e) => {
                            let draftVariants = [...variants];
                            draftVariants[index].mrp = e.target.value;
                            setVariants(draftVariants);
                          }}
                          className="w-full px-3 py-2 outline-none border-2 border-gray-400 rounded-md focus:border-green-500 transition-all duration-300 ease-in-out capitalize"
                          placeholder="Enter mrp variant"
                        />
                      </td>
                      <td className="py-2 px-4 border">
                        <input
                          type="number"
                          value={variant?.cost}
                          onChange={(e) => {
                            let draftVariants = [...variants];
                            draftVariants[index].cost = e.target.value;
                            setVariants(draftVariants);
                          }}
                          className="w-full px-3 py-2 outline-none border-2 border-gray-400 rounded-md focus:border-green-500 transition-all duration-300 ease-in-out capitalize"
                          placeholder="Enter cost variant"
                        />
                      </td>
                      <td className="py-2 px-4 border w-full flex place-items-center justify-center">
                        <button onClick={(e) => deleteVariantRow(e, index)}>
                          <RiDeleteBin5Fill
                            size={25}
                            className="text-red-600"
                          />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <div className="flex justify-between">
          <button
            onClick={saveItemAsDraft}
            className="bg-orange-500 text-white px-4 py-2 rounded"
          >
            Save As Draft
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Item To Inventory
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddItemModal;
