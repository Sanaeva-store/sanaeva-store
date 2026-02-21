"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type AccountPreferenceState = {
  locale: string;
  currency: string;
  selectedWarehouseId?: string;
  setLocale: (locale: string) => void;
  setCurrency: (currency: string) => void;
  setSelectedWarehouseId: (warehouseId?: string) => void;
};

type PersistedAccountPreferenceState = Pick<
  AccountPreferenceState,
  "locale" | "currency" | "selectedWarehouseId"
>;

const safeStorage = createJSONStorage<PersistedAccountPreferenceState>(() => {
  if (typeof window === "undefined") {
    return {
      getItem: () => null,
      setItem: () => undefined,
      removeItem: () => undefined,
    };
  }

  return window.localStorage;
});

export const useAccountPreferenceStore = create<AccountPreferenceState>()(
  persist(
    (set) => ({
      locale: "th-TH",
      currency: "THB",
      selectedWarehouseId: undefined,
      setLocale: (locale) => set({ locale }),
      setCurrency: (currency) => set({ currency }),
      setSelectedWarehouseId: (warehouseId) =>
        set({ selectedWarehouseId: warehouseId }),
    }),
    {
      name: "sanaeva-account-preferences",
      storage: safeStorage,
      partialize: (state): PersistedAccountPreferenceState => ({
        locale: state.locale,
        currency: state.currency,
        selectedWarehouseId: state.selectedWarehouseId,
      }),
    },
  ),
);
