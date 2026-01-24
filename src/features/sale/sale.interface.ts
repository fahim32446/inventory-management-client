import type React from 'react';

export interface ISale {
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
  unitPrice: number;
  subtotal: number;
}
export interface IAddPurISale {
  supplierId: string;
  saleDate: string;
  customerName: string;
  items: {
    purchase_item_id?: number;
    productId: number;
    quantity: number;
    unitCost: number;
    subtotal: number;
  }[];
}

export interface ISelectStockProduct {
  product_name: string;
  stock_product_id: number;
  productId: number;
  quantity: number;
  unitCost: number;
  subtotal: number;
}

export type ISaleList = {
  key?: React.Key;
  saleId: number;
  saleDate: string;
  customerName?: string | null;
  totalQuantity: number;
  totalPrice: number;
  items: ISaleListItem[];
};
export type ISaleListItem = {
  salesItemId: number | null;
  product_name: string | null;
  quantity: number | null;
  unitPrice: number | null;
  subtotal: number | null;
};

export interface ISalesGetForEdit {
  saleId: number;
  saleDate: string;
  customerName: string;
  items: {
    sales_item_id: number;
    productId: number;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }[];
}
