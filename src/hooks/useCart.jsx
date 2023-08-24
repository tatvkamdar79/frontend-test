import React, { useContext, useEffect } from "react";
import { CartContext, GlobalDiscountContext } from "../App";

export default function useCart() {
  const { cart, setCart } = useContext(CartContext);
  const { globalDiscount, setGlobalDiscount } = useContext(
    GlobalDiscountContext
  );

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
    const storedGlobalDiscount = localStorage.getItem("globalDiscount");
    if (storedGlobalDiscount) {
      setGlobalDiscount(storedGlobalDiscount);
    }
  }, []);

  useEffect(() => {
    // Save cart data to localStorage whenever cart changes
    localStorage.setItem("cart", JSON.stringify(cart));
    console.log(cart);
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(
      "globalDiscount",
      JSON.stringify({ globalDiscount: globalDiscount })
    );
    console.log(globalDiscount);
  }, [globalDiscount]);

  const addProductToCart = (product, quantity, manualEntry = false) => {
    const parsedQuantity = parseInt(quantity);
    if (parsedQuantity < 0) {
      return;
    }

    const existingProduct = cart.find(
      (item) => item.product._id === product._id
    );

    if (existingProduct) {
      const updatedCart = cart.map((item) => {
        if (item.product._id === product._id) {
          if (manualEntry) {
            return { ...item, quantity: parsedQuantity };
          }
          return { ...item, quantity: item.quantity + parsedQuantity };
        }
        return item;
      });

      setCart(updatedCart);
    } else {
      // Add the product to the cart with the provided quantity
      setCart([...cart, { product, quantity: parsedQuantity, discount: 0 }]);
    }
  };

  const removeProductFromCart = (product, quantity) => {
    const updatedCart = cart
      .map((item) => {
        if (item.product._id === product._id) {
          const newQuantity = item.quantity - parseInt(quantity);

          if (newQuantity <= 0) {
            // Remove the product from the cart if quantity becomes zero or negative
            return null;
          }

          return { ...item, quantity: newQuantity };
        }
        return item;
      })
      .filter((item) => item !== null);

    setCart(updatedCart);
  };

  const getItemQuantityFromCart = (product) => {
    const cartItem = cart.find((item) => item.product._id === product._id);
    return cartItem ? cartItem.quantity : 0;
  };

  const applyDiscountToItem = (product, discount) => {
    let parsedDiscount = discount ? parseFloat(discount) : 0;
    console.log(parsedDiscount);

    if (
      parsedDiscount == "" ||
      isNaN(parsedDiscount) ||
      parsedDiscount < 0 ||
      parsedDiscount > 100
    ) {
      parsedDiscount = null;
    }

    const updatedCart = cart.map((item) => {
      if (item.product._id === product._id) {
        return { ...item, discount: parsedDiscount };
      }
      return item;
    });

    setCart(updatedCart);
  };

  const showFinalPriceForItem = (product) => {
    const cartItem = cart.find((p) => p.product._id === product._id);
    if (cartItem.discount) {
      return (
        cartItem.product.mrp * (1 - cartItem.discount / 100) * cartItem.quantity
      );
    }
    return cartItem.product.mrp * cartItem.quantity;
  };

  const applyGlobalDiscountToCart = (globalDiscount) => {};

  const getTotalPriceForCart = () => {
    let totalPrice = 0;
    cart.forEach((item) => {
      let finalPriceForProduct = showFinalPriceForItem(item.product);
      if (item.discount && item.discount > 0) {
        totalPrice += finalPriceForProduct;
      } else if (globalDiscount) {
        totalPrice += finalPriceForProduct * (1 - globalDiscount / 100);
      } else {
        totalPrice += finalPriceForProduct;
      }
    });
    return totalPrice;
  };

  const clearCart = () => {
    setCart([]);
  };

  return {
    addProductToCart,
    removeProductFromCart,
    getItemQuantityFromCart,
    applyDiscountToItem,
    showFinalPriceForItem,
    applyGlobalDiscountToCart,
    getTotalPriceForCart,
    clearCart,
  };
}
