import { createBrowserRouter, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import PublicLayout from './components/layout/PublicLayout';
import ProtectedRoute from './components/route/ProtectedRoute';
import PublicRoute from './components/route/PublicRoute';
import LoginPage from './features/auth/pages/LoginPage';
import ComingSoon from './features/ComingSoon';
import DashboardAccount from './features/dashboard/dashboard-account';
import WarehouseList from './features/wearehouse/page/WarehouseList';
import ProductList from './features/product/page/ProductList';
import AddProduct from './features/product/page/AddProduct';
import CategoryList from './features/categories/page/CategoryList';
import SuppliersList from './features/suppliers/page/SuppliersList';
import PurchaseList from './features/purchase/page/PurchaseList';
import SaleList from './features/sale/page/SaleList';
import AddSale from './features/sale/page/AddSale';
import EditSale from './features/sale/page/EditSale';
import Users from './features/administration/pages/Users';
import RoleList from './features/administration/pages/RoleList';
import ManageRole from './features/administration/pages/ManageRole';
import Profile from './features/auth/pages/Profile';
import ForgotPasswordPage from './features/auth/pages/ForgotPasswordPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <PublicRoute>
        <PublicLayout />
      </PublicRoute>
    ),
    children: [
      {
        path: 'auth/login',
        element: <LoginPage />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPasswordPage />,
      },
      {
        path: 'login', // Backward compatibility / redirect
        element: <Navigate to='/auth/login' replace />,
      },
      // Keep other public routes if needed, otherwise just what user asked
    ],
  },

  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'accounts',
        element: <Navigate to='/dashboard' replace />,
      },
      {
        index: true,
        element: <Navigate to='/dashboard' replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardAccount />, // Mapping <Dashboard /> to existing DashboardAccount
      },

      {
        path: 'profile',
        element: <Profile />, // <Profile />
      },

      // Products
      {
        path: 'products',
        element: <ProductList />, // <ProductList />
      },
      {
        path: 'products/add',
        element: <AddProduct />, // <AddProduct />
      },

      // Category
      {
        path: 'category',
        element: <CategoryList />, // <CategoryList />
      },

      // Warehouse
      {
        path: 'warehouse',
        element: <WarehouseList />, // <WarehouseList />
      },

      // Suppliers
      {
        path: 'suppliers',
        element: <SuppliersList />, // <SuppliersList />
      },

      // Purchase
      {
        path: 'purchase',
        element: <PurchaseList />, // <PurchaseList />
      },

      // Sale
      {
        path: 'sale',
        element: <SaleList />, // <SaleList />
      },
      {
        path: 'sale/add',
        element: <AddSale />, // <AddSale />
      },
      {
        path: 'sale/edit/:saleId',
        element: <EditSale />, // <EditSale />
      },

      // Report
      {
        path: 'report',
        children: [
          {
            index: true, // /report
            element: <Navigate to='sales' replace />, // Redirect to first child? Or ComingSoon
          },
          {
            path: 'sales',
            element: <ComingSoon />, // <SalesReport />
          },
          {
            path: 'stock',
            element: <ComingSoon />, // <StockReport />
          },
        ],
      },

      // Administration
      {
        path: 'administration',
        children: [
          {
            index: true,
            element: <Navigate to='users' replace />,
          },
          {
            path: 'users',
            element: <Users />, // <Users />
          },
          {
            path: 'role',
            children: [
              {
                index: true,
                element: <RoleList />, // <RoleList /> (path /administration/role)
              },
              {
                path: 'create',
                element: <ManageRole />, // <ManageRole />
              },
              {
                path: 'update/:roleId',
                element: <ManageRole />, // <ManageRole />
              },
            ],
          },
        ],
      },
    ],
  },
]);
