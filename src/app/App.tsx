import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AppProvider } from "./context/AppContext";
import WelcomeGate from "./components/WelcomeGate";

export default function App() {
  return (
    <AppProvider>
      {window.location.pathname.startsWith("/admin/") ? <RouterProvider router={router} /> : <WelcomeGate><RouterProvider router={router} /></WelcomeGate>}
    </AppProvider>
  );
}
