import Login from "../pages/Login";
import OrderPage from "../pages/orders/OrderPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import SettingsPage from "../pages/settings/SettingsPage";
import ProtectedRoute from "./ProtectedRoute";
import ProductsPage from "../pages/Products/ProductPage";

export const appRoutes = [
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/orders",
    element: (
      <ProtectedRoute>
        <OrderPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <SettingsPage />
      </ProtectedRoute>
    ),
  },
  {
    path:"/products",
    element: (
      <ProtectedRoute>
        <ProductsPage />
      </ProtectedRoute>
    ),
  }
];

