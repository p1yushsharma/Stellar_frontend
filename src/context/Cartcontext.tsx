import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { cartInstance } from '../utilities/AxiosInstance';
import { endpoints } from '../Configuration/Config';
import { useAuth } from './Authcontext';

interface CartItem {
  productId: number;
  quantity: number;
}

interface CartResponse {
  cartId: number;
  userId: number;
  items: CartItem[];
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

  const fetchCart = useCallback(async () => {
    try {
      const response = await cartInstance.get<CartResponse>(endpoints.cart.get);
      setCart(response.data.items ?? []);
    } catch (error: any) {
      console.error('Fetch Cart - Error:', error?.response?.status, error?.message);
      setCart([]);
    }
  }, []);

  const updateQuantity = useCallback(
    async (productId: number, quantity: number) => {
      try {
        await cartInstance.put(endpoints.cart.update, { productId, quantity });
        setCart(prevCart =>
          prevCart.map(item =>
            item.productId === productId ? { ...item, quantity } : item
          )
        );
      } catch (error) {
        console.error('Failed to update cart quantity:', error);
      }
    },
    []
  );

  const addToCart = useCallback(
    async (productId: number, quantity: number) => {
      try {
        const existingItem = cart.find(item => item.productId === productId);
        if (existingItem) {
          await updateQuantity(productId, existingItem.quantity + quantity);
        } else {
          await cartInstance.post(endpoints.cart.add, { productId, quantity });

          setCart(prevCart => [...prevCart, { productId, quantity }]);
        }
      } catch (error) {
        console.error('Failed to add to cart:', error);
      }
    },
    [cart, updateQuantity]
  );

  const removeFromCart = useCallback(
    async (productId: number) => {
      try {
        await cartInstance.delete(endpoints.cart.remove(productId));
        // Remove item locally
        setCart(prevCart => prevCart.filter(item => item.productId !== productId));
      } catch (error) {
        console.error('Failed to remove from cart:', error);
      }
    },
    []
  );

  const clearCart = useCallback(async () => {
    try {
      await cartInstance.delete(endpoints.cart.clear);
      setCart([]);
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  }, []);

  useEffect(() => {
    if (authState?.authenticated) {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [authState?.authenticated, fetchCart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        fetchCart,
        updateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
