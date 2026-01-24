import type React from "react";

export interface IPurchase {
  key?: React.Key;
  action?: React.ReactNode;

  purchaseId: number;
  purchase_item_id?: number;
  supplierId: string;
  supplier_name: string;
  purchaseDate: string;
  product_name: string;
  productId: number;
  quantity: number;
  unitCost: number;
  subtotal: number;
}
export interface IAddPurIPurchase {
  supplierId: string;
  purchaseDate: any;
  items: {
    purchase_item_id?: number;
    productId: number;
    quantity: number;
    unitCost: number;
    subtotal: number;
  }[];
}
