export interface IStockReport {
  key?: React.Key;
  productId: number;
  name: string;
  totalPurchased: string;
  totalSold: string;
  currentStock: string;
}
export interface ISalesReport {
  key?: React.Key;
  salesId: number;
  purchaseId: number;
  saleDate: string;
  customerName: string;
  salesQuantity: number;
  salesUnitPrice: number;
  purchaseUnitCost: number;
  salesSubtotal: number;
  profitLoss?: any;
}
