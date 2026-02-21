"use client";

import { create } from "zustand";

type InventoryFilters = {
  warehouseId?: string;
  variantId?: string;
  transactionType?: string;
  fromDate?: string;
  toDate?: string;
};

type InventoryUiState = {
  filters: InventoryFilters;
  isFilterDrawerOpen: boolean;
  selectedTransactionId?: string;
  setFilters: (filters: InventoryFilters) => void;
  resetFilters: () => void;
  setFilterDrawerOpen: (isOpen: boolean) => void;
  setSelectedTransactionId: (transactionId?: string) => void;
};

const defaultFilters: InventoryFilters = {};

export const useInventoryUiStore = create<InventoryUiState>((set) => ({
  filters: defaultFilters,
  isFilterDrawerOpen: false,
  selectedTransactionId: undefined,
  setFilters: (filters) => set({ filters }),
  resetFilters: () => set({ filters: defaultFilters }),
  setFilterDrawerOpen: (isOpen) => set({ isFilterDrawerOpen: isOpen }),
  setSelectedTransactionId: (transactionId) =>
    set({ selectedTransactionId: transactionId }),
}));
