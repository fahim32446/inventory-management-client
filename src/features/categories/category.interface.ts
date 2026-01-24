import type React from 'react';

export interface ICategory {
  key?: React.Key;
  catId: string;
  name: string;
  description: string;
  action?: React.ReactNode;
  createdAt: string;
}
