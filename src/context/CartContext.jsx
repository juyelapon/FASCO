import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext();

const CART_STORAGE_KEY = 'fasco_cart';

const getStoredCart = () => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return [];
    const parsedCart = JSON.parse(stored);
    return Array.isArray(parsedCart) ? parsedCart : [];
  } catch (error) {
    console.error('Failed to load cart from local storage:', error);
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(getStoredCart);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('Failed to save cart to local storage:', error);
    }
  }, [cart]);

  const addToCart = useCallback((product, qty = 1) => {
    const quantityToAdd = typeof qty === 'number' && qty > 0 ? qty : 1;
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item
        );
      }
      return [...prev, { ...product, quantity: quantityToAdd }];
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity < 1) {
      setCart((prev) => prev.filter((item) => item.id !== productId));
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const cartTotal = useMemo(
    () => cart.reduce((total, item) => {
      const discount = Math.min(100, Math.max(0, item.discountPercentage || 0));
      const price = item.price * (1 - discount / 100);
      return total + price * item.quantity;
    }, 0),
    [cart]
  );

  const cartCount = useMemo(
    () => cart.reduce((count, item) => count + item.quantity, 0),
    [cart]
  );

  const getCartTotal = useCallback(() => cartTotal, [cartTotal]);
  const getCartCount = useCallback(() => cartCount, [cartCount]);

  const value = useMemo(
    () => ({
      cart,
      cartItems: cart, // alias for components expecting cartItems
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount,
      getCartTotal,
      getCartCount,
    }),
    [cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount, getCartTotal, getCartCount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
