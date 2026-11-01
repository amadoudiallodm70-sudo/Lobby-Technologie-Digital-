import React, { createContext, useContext, useState } from 'react';
import { OrderItem } from '../types';

interface CartContextType {
  items: OrderItem[];
  addItem: (item: OrderItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  checkoutItem: OrderItem | null;
  isCheckoutOpen: boolean;
  openCheckoutWithItem: (item: OrderItem) => void;
  openCartCheckout: () => void;
  closeCheckout: () => void;
  totalGNF: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [checkoutItem, setCheckoutItem] = useState<OrderItem | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const addItem = (item: OrderItem) => {
    if (!items.some(i => i.id === item.id)) {
      setItems(prev => [...prev, item]);
    }
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  const openCheckoutWithItem = (item: OrderItem) => {
    setCheckoutItem(item);
    setIsCheckoutOpen(true);
  };

  const openCartCheckout = () => {
    if (items.length > 0) {
      setCheckoutItem(null); // Indicates entire cart
      setIsCheckoutOpen(true);
    }
  };

  const closeCheckout = () => {
    setIsCheckoutOpen(false);
    setCheckoutItem(null);
  };

  const totalGNF = items.reduce((sum, item) => sum + (item.priceGNF || 0), 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearCart,
        checkoutItem,
        isCheckoutOpen,
        openCheckoutWithItem,
        openCartCheckout,
        closeCheckout,
        totalGNF,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
