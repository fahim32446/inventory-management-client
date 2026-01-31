export interface IDashboard {
  stats: IDashboardStat[];
  cashFlow: IDashboardCashFlow[];
  revenueDistribution: IDashboardRevenueDistribution[];
  recentTransactions: IDashboardRecentTransaction[];
}

export interface IDashboardCashFlow {
  month: string;
  inflow: string;
  outflow: string;
  [key: string]: string | number | undefined;
}

export interface IDashboardRecentTransaction {
  key: string;
  id: string;
  date: Date;
  customer: string;
  amount: number;
  status: string;
  type: string;
  category: string;
}

export interface IDashboardRevenueDistribution {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number | undefined;
}

export interface IDashboardStat {
  title: string;
  value: string;
  trend: string;
  isUp: boolean;
  icon: string;
  color: string;
}
