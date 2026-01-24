import {
  Banknote,
  BarChart2,
  Folder,
  Home,
  LayoutGrid,
  Lock,
  Network,
  Package,
  ShoppingCart,
} from "lucide-react";

export interface MenuItemType {
  icon?: React.ElementType;
  label: string;
  path?: string;
  children?: MenuItemType[];
}

export const menuItems: MenuItemType[] = [
  {
    path: "/dashboard",
    label: "Dashboards",
    icon: Home,
  },

  {
    path: "/products",
    label: "Products",
    icon: Package,
  },
  {
    path: "/products/add",
    icon: Package,
    label: "Add Product",
  },
  {
    path: "/category",
    label: "Category",
    icon: LayoutGrid,
  },
  {
    path: "/warehouse",
    label: "Warehouse",
    icon: Folder,
  },
  {
    path: "/suppliers",
    label: "Suppliers",
    icon: Network,
  },

  {
    path: "/purchase",
    label: "Purchase",
    icon: ShoppingCart,
  },
  {
    path: "/sale",
    label: "Sale",
    icon: Banknote,
  },
  {
    path: "/sale/add",
    label: "Sale",
    icon: Banknote,
  },
  {
    path: "/sale/edit/:saleId",
    label: "Sale",
    icon: Banknote,
  },

  {
    path: "/report",
    label: "Report",
    icon: BarChart2,

    children: [
      {
        path: "/report/sales",
        label: "Sales",
      },
      {
        path: "/report/stock",
        label: "Stock",
      },
    ],
  },

  {
    path: "/administration",
    label: "Administration",
    icon: Lock,

    children: [
      {
        path: "/administration/users",
        label: "Users",
      },
      {
        path: "/administration/role",
        label: "Role",
      },
      {
        path: "/administration/role/create",
        label: "Role",
      },
      {
        path: "/administration/role/update/:roleId",
        label: "Role",
      },
    ],
  },
];
