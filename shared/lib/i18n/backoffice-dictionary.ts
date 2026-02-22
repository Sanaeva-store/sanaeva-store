import type { Locale } from "./config";

import enSidebar from "@/messages/en/backoffice/sidebar.json";
import thSidebar from "@/messages/th/backoffice/sidebar.json";
import enNavbar from "@/messages/en/backoffice/navbar.json";
import thNavbar from "@/messages/th/backoffice/navbar.json";
import enDashboardOverview from "@/messages/en/backoffice/dashboard-overview.json";
import thDashboardOverview from "@/messages/th/backoffice/dashboard-overview.json";
import enAnalytics from "@/messages/en/backoffice/analytics.json";
import thAnalytics from "@/messages/th/backoffice/analytics.json";
import enCustomers from "@/messages/en/backoffice/customers.json";
import thCustomers from "@/messages/th/backoffice/customers.json";
import enOrderManagement from "@/messages/en/backoffice/order-management.json";
import thOrderManagement from "@/messages/th/backoffice/order-management.json";
import enSettingsGeneral from "@/messages/en/backoffice/settings-general.json";
import thSettingsGeneral from "@/messages/th/backoffice/settings-general.json";
import enSettingsReports from "@/messages/en/backoffice/settings-reports.json";
import thSettingsReports from "@/messages/th/backoffice/settings-reports.json";
import enInventoryDashboard from "@/messages/en/backoffice/inventory-dashboard.json";
import thInventoryDashboard from "@/messages/th/backoffice/inventory-dashboard.json";
import enProductSku from "@/messages/en/backoffice/product-sku.json";
import thProductSku from "@/messages/th/backoffice/product-sku.json";
import enInventoryLowStock from "@/messages/en/backoffice/inventory-low-stock.json";
import thInventoryLowStock from "@/messages/th/backoffice/inventory-low-stock.json";
import enInventoryTransactions from "@/messages/en/backoffice/inventory-transactions.json";
import thInventoryTransactions from "@/messages/th/backoffice/inventory-transactions.json";
import enInventoryReceiving from "@/messages/en/backoffice/inventory-receiving.json";
import thInventoryReceiving from "@/messages/th/backoffice/inventory-receiving.json";
import enInventoryInitialStock from "@/messages/en/backoffice/inventory-initial-stock.json";
import thInventoryInitialStock from "@/messages/th/backoffice/inventory-initial-stock.json";
import enInventoryAdjustment from "@/messages/en/backoffice/inventory-adjustment.json";
import thInventoryAdjustment from "@/messages/th/backoffice/inventory-adjustment.json";
import enInventorySuppliers from "@/messages/en/backoffice/inventory-suppliers.json";
import thInventorySuppliers from "@/messages/th/backoffice/inventory-suppliers.json";

export const backofficeNamespaces = [
  "sidebar",
  "navbar",
  "dashboard-overview",
  "analytics",
  "customers",
  "order-management",
  "settings-general",
  "settings-reports",
  "inventory-dashboard",
  "product-sku",
  "inventory-low-stock",
  "inventory-transactions",
  "inventory-receiving",
  "inventory-initial-stock",
  "inventory-adjustment",
  "inventory-suppliers",
] as const;

export type BackofficeNamespace = (typeof backofficeNamespaces)[number];

const dictionaries = {
  en: {
    "sidebar": enSidebar,
    "navbar": enNavbar,
    "dashboard-overview": enDashboardOverview,
    "analytics": enAnalytics,
    "customers": enCustomers,
    "order-management": enOrderManagement,
    "settings-general": enSettingsGeneral,
    "settings-reports": enSettingsReports,
    "inventory-dashboard": enInventoryDashboard,
    "product-sku": enProductSku,
    "inventory-low-stock": enInventoryLowStock,
    "inventory-transactions": enInventoryTransactions,
    "inventory-receiving": enInventoryReceiving,
    "inventory-initial-stock": enInventoryInitialStock,
    "inventory-adjustment": enInventoryAdjustment,
    "inventory-suppliers": enInventorySuppliers,
  },
  th: {
    "sidebar": thSidebar,
    "navbar": thNavbar,
    "dashboard-overview": thDashboardOverview,
    "analytics": thAnalytics,
    "customers": thCustomers,
    "order-management": thOrderManagement,
    "settings-general": thSettingsGeneral,
    "settings-reports": thSettingsReports,
    "inventory-dashboard": thInventoryDashboard,
    "product-sku": thProductSku,
    "inventory-low-stock": thInventoryLowStock,
    "inventory-transactions": thInventoryTransactions,
    "inventory-receiving": thInventoryReceiving,
    "inventory-initial-stock": thInventoryInitialStock,
    "inventory-adjustment": thInventoryAdjustment,
    "inventory-suppliers": thInventorySuppliers,
  },
} as const;

type DictionaryValue = string | number | boolean | Record<string, unknown> | undefined;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

function deepGet(value: unknown, path: string): DictionaryValue {
  if (!path) return value as DictionaryValue;

  return path.split(".").reduce<unknown>((acc, key) => {
    if (!isRecord(acc)) return undefined;
    return acc[key];
  }, value) as DictionaryValue;
}

export function getBackofficeDictionary(locale: Locale, namespace: BackofficeNamespace) {
  return dictionaries[locale][namespace] ?? dictionaries.th[namespace];
}

function applyParams(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;
  return Object.entries(params).reduce((result, [key, value]) => {
    return result.replaceAll(`{{${key}}}`, String(value));
  }, template);
}

export function getBackofficeText(
  locale: Locale,
  namespace: BackofficeNamespace,
  key: string,
  fallback?: string,
  params?: Record<string, string | number>,
): string {
  const current = deepGet(dictionaries[locale][namespace], key);
  const defaultValue = deepGet(dictionaries.th[namespace], key);
  const raw = (current ?? defaultValue ?? fallback ?? key) as string;
  return applyParams(raw, params);
}

export function createBackofficeTranslator(locale: Locale, namespace: BackofficeNamespace) {
  return (key: string, fallback?: string, params?: Record<string, string | number>) =>
    getBackofficeText(locale, namespace, key, fallback, params);
}
