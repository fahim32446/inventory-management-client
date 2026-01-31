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
import { PERMISSION_TYPE } from "../../features/auth/auth.interface";

export interface MenuItemType {
  icon?: React.ElementType;
  label: string;
  path?: string;
  children?: MenuItemType[];
  permissions?: PERMISSION_TYPE[];
}

export const menuItems: MenuItemType[] = [
  {
    path: "/dashboard",
    label: "Dashboards",
    icon: Home,
    permissions: ["dashboard:read"],
  },

  {
    path: "/products",
    label: "Products",
    icon: Package,
    permissions: ["products:read", "products:create", "products:update", "products:delete"],
  },

  {
    path: "/category",
    label: "Category",
    icon: LayoutGrid,
    permissions: ["category:read", "category:create", "category:update", "category:delete"],
  },
  {
    path: "/warehouse",
    label: "Warehouse",
    icon: Folder,
    permissions: ["warehouse:read", "warehouse:create", "warehouse:update", "warehouse:delete"],
  },
  {
    path: "/suppliers",
    label: "Suppliers",
    icon: Network,
    permissions: ["suppliers:read", "suppliers:create", "suppliers:update", "suppliers:delete"],
  },

  {
    path: "/purchase",
    label: "Purchase",
    icon: ShoppingCart,
    permissions: ["purchase:read", "purchase:create", "purchase:update", "purchase:delete"],
  },
  {
    path: "/sale",
    label: "Sale",
    icon: Banknote,
    permissions: ["sale:read", "sale:create", "sale:update", "sale:delete"],
  },

  {
    path: "/report",
    label: "Report",
    icon: BarChart2,
    permissions: ["report:read"],
    children: [
      {
        path: "/report/sales",
        label: "Sales",
        permissions: ["report:read"],
      },
      {
        path: "/report/stock",
        label: "Stock",
        permissions: ["report:read"],
      },
    ],
  },

  {
    path: "/administration",
    label: "Administration",
    icon: Lock,
    permissions: ["administration:read", "administration:update"],
    children: [
      {
        path: "/administration/users",
        label: "Users",
        permissions: [
          "administration:users:read",
          "administration:users:create",
          "administration:users:update",
          "administration:users:delete",
        ],
      },
      {
        path: "/administration/role",
        label: "Role",
        permissions: [
          "administration:roles:read",
          "administration:roles:create",
          "administration:roles:update",
          "administration:roles:delete",
        ],
      },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*                            MENU ITEM HELPERS                               */
/* -------------------------------------------------------------------------- */

/**
 * Checks if a user has at least one of the required permissions.
 */
export const hasPermission = (
  itemPermissions?: PERMISSION_TYPE[],
  userPermissions?: PERMISSION_TYPE[] | null,
): boolean => {
  if (!itemPermissions || itemPermissions.length === 0) return true;
  if (!userPermissions) return false;
  return itemPermissions.some((perm) => userPermissions.includes(perm));
};

/**
 * Filter menu items based on user permissions recursively.
 */
export const filterMenuItemsByPermission = (
  items: MenuItemType[],
  userPermissions?: PERMISSION_TYPE[] | null,
): MenuItemType[] => {
  return items.reduce<MenuItemType[]>((acc, item) => {
    if (!hasPermission(item.permissions, userPermissions)) return acc;

    let validChildren: MenuItemType[] = [];
    if (item.children) {
      validChildren = filterMenuItemsByPermission(item.children, userPermissions);
    }

    // Keep item if it has a path or valid children
    if (item.path || validChildren.length > 0) {
      acc.push({
        ...item,
        children: validChildren.length > 0 ? validChildren : undefined,
      });
    }
    return acc;
  }, []);
};

/**
 * Check if any descendant of a menu item is active.
 */
export const isAnyChildActive = (item: MenuItemType, activeRoute: string): boolean => {
  if (!item.children) return false;
  return item.children.some((child) => {
    const isActive = child.path
      ? activeRoute === child.path ||
        (child.path !== "/" && activeRoute.startsWith(child.path + "/"))
      : false;
    return isActive || isAnyChildActive(child, activeRoute);
  });
};

/**
 * Determine which menus should be open based on the current active route.
 */
export const getActiveOpenMenus = (
  path: string,
  items: MenuItemType[],
  parentKey = "",
): Record<string, boolean> => {
  const openMenus: Record<string, boolean> = {};

  const traverse = (list: MenuItemType[], pKey = "") => {
    let branchHasActive = false;

    for (const item of list) {
      const key = pKey ? `${pKey}-${item.label}` : item.label;
      let childActive = false;

      if (item.children) {
        childActive = traverse(item.children, key);
        if (childActive) {
          openMenus[key] = true;
          branchHasActive = true;
        }
      }

      const selfActive =
        item.path &&
        (path === item.path || (item.path !== "/" && path.startsWith(item.path + "/")));

      if (selfActive || childActive) {
        branchHasActive = true;
      }
    }
    return branchHasActive;
  };

  traverse(items, parentKey);
  return openMenus;
};
