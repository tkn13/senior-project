import ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import './css/main.css'

import { AuthProvider } from "./context/AuthContext";

import { Home } from "./pages/Home";
import { Job } from "./pages/Job";
import { Node } from "./pages/Node";
import { Login } from "./pages/Login";

import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";

const router = createBrowserRouter([
    {
      element: <ProtectedRoute />,
      children: [
        {
          path: "/",
          Component: Layout,
          children: [
            { index: true, Component: Home },
            { path: "node", Component: Node },
            { path: "job", Component: Job }
          ],
        }
      ]
    },
    {
      path: "/login",
      Component: Login
    },
]);

const root = document.getElementById("root")!;

ReactDOM.createRoot(root).render(
    <AuthProvider>
        <RouterProvider router={router} />
    </AuthProvider>
);
