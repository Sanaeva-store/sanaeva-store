"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CartItem = {
  itemId: string;
  variantId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  imageUrl?: string;
};

type CartState = {
  currency: string;
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  setCurrency: (currency: string) => void;
};

type PersistedCartState = Pick<CartState, "currency" | "items">;

const safeStorage = createJSONStorage<PersistedCartState>(() => {
  if (typeof window === "undefined") {
    return {
      getItem: () => null,
      setItem: () => undefined,
      removeItem: () => undefined,
    };
  }

  return window.localStorage;
});

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      currency: "THB",
      items: [],
      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find(
            (currentItem) => currentItem.itemId === item.itemId,
          );

          if (!existingItem) {
            return { items: [...state.items, item] };
          }

          return {
            items: state.items.map((currentItem) =>
              currentItem.itemId === item.itemId
                ? {
                    ...currentItem,
                    quantity: currentItem.quantity + item.quantity,
                  }
                : currentItem,
            ),
          };
        }),
      removeItem: (itemId) =>
        set((state) => ({
          items: state.items.filter((item) => item.itemId !== itemId),
        })),
      updateQuantity: (itemId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.itemId === itemId
              ? { ...item, quantity: Math.max(1, Math.trunc(quantity)) }
              : item,
          ),
        })),
      clearCart: () => set({ items: [] }),
      setCurrency: (currency) => set({ currency }),
    }),
    {
      name: "sanaeva-cart",
      storage: safeStorage,
      partialize: (state): PersistedCartState => ({
        currency: state.currency,
        items: state.items,
      }),
    },
  ),
);
