import React, { createContext, useState, useContext } from 'react';

// Create a Context for the cart
const CartContext = createContext();

// Create a custom hook to use the CartContext
export const useCart = () => {
  return useContext(CartContext);
};

// Create a provider to wrap around components that need access to the cart state
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]); // Initial cart state

  // Add item to the cart
  const addToCart = (bike) => {
    setCart((prevCart) => [...prevCart, bike]);
  };

  // Return the context provider with values (cart and addToCart)
  return (
    <CartContext.Provider value={{ cart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};
