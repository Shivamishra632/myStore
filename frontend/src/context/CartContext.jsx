import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const getStoredCart = () => {
    try {
      return JSON.parse(localStorage.getItem("cartItems")) || [];
    } catch {
      return [];
    }
  };

  const [cartItems, setCartItems] = useState(getStoredCart);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existItem = prevItems.find(
        (item) => item._id === product._id
      );

      if (existItem) {
        return prevItems.map((item) =>
          item._id === product._id
            ? { ...item, qty: product.qty }
            : item
        );
      } else {
        return [...prevItems, product];
      }
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item._id !== id)
    );
  };

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(
      "cartItems",
      JSON.stringify(cartItems)
    );
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart }}
    >
      {children}
    </CartContext.Provider>
  );
};