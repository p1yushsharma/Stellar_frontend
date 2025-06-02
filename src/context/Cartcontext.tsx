import React, { createContext, useContext, useEffect, useState } from 'react';
import { cartInstance } from '../utilities/AxiosInstance';
import { endpoints } from '../Configuration/Config';
import { useAuth } from './Authcontext';

interface CartItem {
  productId: number;
  quantity: number;
}

interface CartContextProps {
  cart: CartItem[];
  addToCart: (productId: number, quantity: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
}

const CartContext = createContext<CartContextProps>({
  cart: [],
  addToCart: async () => {},
  removeFromCart: async () => {},
  clearCart: async () => {},
  fetchCart: async () => {},
  updateQuantity: async () => {},
});

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { authState } = useAuth();

  const fetchCart = async () => {
  try {
    // Log headers for debug
    console.log('Fetch Cart - Auth Headers:', cartInstance.defaults.headers.common['Authorization']);
    
    const response = await cartInstance.get<CartItem[]>(endpoints.cart.get);
    setCart(response.data);
  } catch (error) {
    console.error('Failed to fetch cart:', error);
  }
};

const addToCart = async (productId: number, quantity: number) => {
  try {
    console.log('AddToCart - Auth Headers:', cartInstance.defaults.headers.common['Authorization']);

    await cartInstance.post(endpoints.cart.add, { productId, quantity });
    await fetchCart(); 
  } catch (error) {
    console.error('Failed to add to cart:', error);
  }
};


  const removeFromCart = async (productId: number) => {
    try {
      await cartInstance.delete(endpoints.cart.remove(productId));
      await fetchCart(); 
    } catch (error) {
      console.error('Failed to remove from cart:', error);
    }
  };

  const clearCart = async () => {
    try {
      await cartInstance.delete(endpoints.cart.clear);
      setCart([]);
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    try {
      await cartInstance.put(endpoints.cart.update, { productId, quantity });
      await fetchCart();
    } catch (error) {
      console.error('Failed to update cart quantity:', error);
    }
  };

  useEffect(() => {
    if (authState?.authenticated) {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [authState?.authenticated]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, fetchCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};
