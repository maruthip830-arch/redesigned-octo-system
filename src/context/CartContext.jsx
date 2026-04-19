import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product) => {
    // Prevent adding duplicates, set default duration to 1 month
    if (!cart.find(item => item.id === product.id)) {
      setCart([...cart, { ...product, duration: '1_month' }]);
    }
    // Automatically slide out the Cart UI on add
    setIsCartOpen(true);
  };
  
  const updateItemDuration = (id, newDuration) => {
    setCart(cart.map(item => item.id === id ? { ...item, duration: newDuration } : item));
  };
  
  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };
  
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => {
    setIsCartOpen(false);
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart,
      updateItemDuration,
      clearCart, 
      isCartOpen, 
      openCart, 
      closeCart 
    }}>
      {children}
    </CartContext.Provider>
  );
};
