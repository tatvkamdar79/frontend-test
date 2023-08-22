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
