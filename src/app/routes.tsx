import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import WelcomeGate from "./components/WelcomeGate";
import Home from "./pages/Home";
import Account from "./pages/Account";
import About from "./pages/About";
import Collections from "./pages/Collections";
import CustomOrders from "./pages/CustomOrders";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import Catalog from "./pages/Catalog";

export const router = createBrowserRouter([
  { path: "/admin/io", Component: Admin },
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, element: <WelcomeGate><Home /></WelcomeGate> },
      { path: "account", Component: Account },
      { path: "about", Component: About },
      { path: "catalog", Component: Catalog },
      { path: "collections", Component: Collections },
      { path: "custom-orders", Component: CustomOrders },
      { path: "*", Component: NotFound },
    ],
  },
]);
