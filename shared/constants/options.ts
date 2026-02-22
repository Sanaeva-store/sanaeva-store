export const adjustmentReasonOptions = [
  { value: "DAMAGE", label: "Damaged Goods" },
  { value: "LOST", label: "Loss/Theft" },
  { value: "FOUND", label: "Found Stock" },
  { value: "MANUAL_CORRECTION", label: "Inventory Correction" },
] as const;

export const stockTxnTypeOptions = [
  { value: "INBOUND", label: "Inbound" },
  { value: "OUTBOUND", label: "Outbound" },
  { value: "ADJUST", label: "Adjustment" },
  { value: "INITIALIZE", label: "Initialize" },
  { value: "RESERVE", label: "Reserve" },
  { value: "RELEASE", label: "Release" },
  { value: "TRANSFER_IN", label: "Transfer In" },
  { value: "TRANSFER_OUT", label: "Transfer Out" },
] as const;

export type AdjustmentReasonValue = (typeof adjustmentReasonOptions)[number]["value"];
export type StockTxnTypeValue = (typeof stockTxnTypeOptions)[number]["value"];
