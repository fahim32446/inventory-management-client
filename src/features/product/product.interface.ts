import type React from 'react';

export interface IProduct {
  key?: React.Key;
  productId: string;
  name: string;
  description: string;
  sku: string;
  action?: React.ReactNode;
}
export interface IAddProduct {
  catId: string;
  name: string;
  sku: string;
  description: string;
}
