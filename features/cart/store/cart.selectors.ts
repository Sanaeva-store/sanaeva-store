"use client";

import { useCartStore } from "@/features/cart/store/cart.store";
import { useShallow } from "zustand/react/shallow";

export const useCartCurrency = () => useCartStore((state) => state.currency);
export const useCartItems = () => useCartStore((state) => state.items);

export const useCartTotals = () =>
  useCartStore(
    useShallow((state) => {
      const subtotal = state.items.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity,
        0,
      );

      const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);

      return {
        subtotal,
        totalItems,
        itemLines: state.items.length,
      };
    }),
  );

export const useCartActions = () =>
  useCartStore(
    useShallow((state) => ({
      addItem: state.addItem,
      removeItem: state.removeItem,
      updateQuantity: state.updateQuantity,
      clearCart: state.clearCart,
      setCurrency: state.setCurrency,
    })),
  );
