import { createBrowserRouter, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import PublicLayout from './components/layout/PublicLayout';
import PermissionRoute from './components/route/PermissionRoute';
import ProtectedRoute from './components/route/ProtectedRoute';
import PublicRoute from './components/route/PublicRoute';
import ManageRole from './features/administration/pages/ManageRole';
import RoleList from './features/administration/pages/RoleList';
import Users from './features/administration/pages/Users';
import ForgotPasswordPage from './features/auth/pages/ForgotPasswordPage';
import LoginPage from './features/auth/pages/LoginPage';
import Profile from './features/auth/pages/Profile';
import CategoryList from './features/categories/page/CategoryList';
import DashboardAccount from './features/dashboard/dashboard-account';
import AddProduct from './features/product/page/AddProduct';
import ProductList from './features/product/page/ProductList';
import PurchaseList from './features/purchase/page/PurchaseList';
import SalesReport from './features/report/page/SalesReport';
import StockReport from './features/report/page/StockReport';
import AddSale from './features/sale/page/AddSale';
import EditSale from './features/sale/page/EditSale';
import SaleList from './features/sale/page/SaleList';
import SuppliersList from './features/suppliers/page/SuppliersList';
import WarehouseList from './features/wearehouse/page/WarehouseList';

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
        path: 'login',
        element: <Navigate to='/auth/login' replace />,
      },
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
        element: (
          <PermissionRoute permissions={['dashboard:read']}>
            <DashboardAccount />
          </PermissionRoute>
        ),
      },

      {
        path: 'profile',
        element: <Profile />,
      },

      // Products
      {
        path: 'products',
        element: (
          <PermissionRoute permissions={['products:read']}>
            <ProductList />
          </PermissionRoute>
        ),
      },
      {
        path: 'products/add',
        element: (
          <PermissionRoute permissions={['products:create']}>
            <AddProduct />
          </PermissionRoute>
        ),
      },

      // Category
      {
        path: 'category',
        element: (
          <PermissionRoute permissions={['category:read']}>
            <CategoryList />
          </PermissionRoute>
        ),
      },

      // Warehouse
      {
        path: 'warehouse',
        element: (
          <PermissionRoute permissions={['warehouse:read']}>
            <WarehouseList />
          </PermissionRoute>
        ),
      },

      // Suppliers
      {
        path: 'suppliers',
        element: (
          <PermissionRoute permissions={['suppliers:read']}>
            <SuppliersList />
          </PermissionRoute>
        ),
      },

      // Purchase
      {
        path: 'purchase',
        element: (
          <PermissionRoute permissions={['purchase:read']}>
            <PurchaseList />
          </PermissionRoute>
        ),
      },

      // Sale
      {
        path: 'sale',
        element: (
          <PermissionRoute permissions={['sale:read']}>
            <SaleList />
          </PermissionRoute>
        ),
      },
      {
        path: 'sale/add',
        element: (
          <PermissionRoute permissions={['sale:create']}>
            <AddSale />
          </PermissionRoute>
        ),
      },
      {
        path: 'sale/edit/:saleId',
        element: (
          <PermissionRoute permissions={['sale:update']}>
            <EditSale />
          </PermissionRoute>
        ),
      },

      // Report
      {
        path: 'report',
        children: [
          {
            index: true,
            element: <Navigate to='sales' replace />,
          },
          {
            path: 'sales',
            element: (
              <PermissionRoute permissions={['report:read']}>
                <SalesReport />
              </PermissionRoute>
            ),
          },
          {
            path: 'stock',
            element: (
              <PermissionRoute permissions={['report:read']}>
                <StockReport />
              </PermissionRoute>
            ),
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
            element: (
              <PermissionRoute permissions={['administration:users:read']}>
                <Users />
              </PermissionRoute>
            ),
          },
          {
            path: 'role',
            children: [
              {
                index: true,
                element: (
                  <PermissionRoute permissions={['administration:roles:read']}>
                    <RoleList />
                  </PermissionRoute>
                ),
              },
              {
                path: 'create',
                element: (
                  <PermissionRoute permissions={['administration:roles:create']}>
                    <ManageRole />
                  </PermissionRoute>
                ),
              },
              {
                path: 'update/:roleId',
                element: (
                  <PermissionRoute permissions={['administration:roles:update']}>
                    <ManageRole />
                  </PermissionRoute>
                ),
              },
            ],
          },
        ],
      },
    ],
  },
]);
