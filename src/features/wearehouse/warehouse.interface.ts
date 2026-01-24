import type React from 'react';

export interface IWarehouse {
  key?: React.Key;
  whId: number;
  location: string;
  name: string;
  createdAt: string;
}
