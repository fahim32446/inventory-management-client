import type React from 'react';

export interface ISupplier {
  key?: React.Key;
  action?: React.ReactNode;

  supId: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  createdAt: string;
}
export interface IAddSupplier {
  supId: string;
  name: string;
  address: string;
  email: string;
  phone: string;
}
