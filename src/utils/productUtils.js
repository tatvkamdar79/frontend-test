import axios from "axios";
import { baseUrl, productAPI } from "./constants";

export const formatProductWithVariantsData = (products, modelNumber) => {
  let productWithVariants = products[modelNumber];
  let productTitle = productWithVariants[0].productTitle;
  let variantCount = products[modelNumber].length;

  let minPrice = productWithVariants.reduce((min, product) => {
    if (product.mrp !== undefined && product.mrp < min) {
      return product.mrp;
    }
    return min;
  }, Number.POSITIVE_INFINITY);

  let maxPrice = productWithVariants.reduce((max, product) => {
    if (product.mrp !== undefined && product.mrp > max) {
      return product.mrp;
    }
    return max;
  }, Number.NEGATIVE_INFINITY);

  // Format minPrice and maxPrice
  const formattedMinPrice = isFinite(minPrice)
    ? minPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    : "N/A";
  const formattedMaxPrice = isFinite(maxPrice)
    ? maxPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    : "N/A";

  // Extract sizes, colors, styles, and materials
  const variants = productWithVariants.map((product) => product.variant);
  const sizes = Array.from(
    new Set(variants.map((variant) => variant?.size).filter(Boolean))
  );
  const colors = Array.from(
    new Set(variants.map((variant) => variant?.color).filter(Boolean))
  );
  const styles = Array.from(
    new Set(variants.map((variant) => variant?.style).filter(Boolean))
  );
  const materials = Array.from(
    new Set(variants.map((variant) => variant?.material).filter(Boolean))
  );

  const variantOptions = {
    sizes,
    colors,
    styles,
    materials,
  };

  return {
    productTitle,
    minPrice: formattedMinPrice,
    maxPrice: formattedMaxPrice,
    variantCount,
    materials,
    sizes,
    colors,
    styles,
  };
};

const makeTags = (product) => {
  const fieldsToCheck = [
    "modelNumber",
    "company",
    "productTitle",
    "productType",
    "productCategory",
    "additionalIdentifier",
    "description",
  ];

  const tags = [];

  fieldsToCheck.forEach((fieldName) => {
    const fieldValue = product[fieldName];
    if (fieldValue && fieldValue.trim() !== "") {
      tags.push(fieldValue);
    }
  });

  return tags;
};

export const addProduct = async (product, variants) => {
  let allProducts = [];
  for (let variant of variants) {
    let productVariant = { ...product };
    let { mrp, cost, ...currenVariant } = variant;
    productVariant["mrp"] = mrp;
    productVariant["cost"] = cost;
    productVariant["variant"] = currenVariant;
    productVariant["tags"] = makeTags(product);
    delete productVariant["variants"];
    allProducts.push(productVariant);
  }

  console.log(allProducts);
  const url = `${baseUrl}${productAPI}/addProduct`;
  try {
    const response = await axios.post(url, allProducts);
    console.log("response", response);
    return response.data;
  } catch (error) {
    alert(error.response.data.message);
    return error;
  }
};
