// src/main.jsx — Application entry point
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./context/AuthContext";
import App from "./App";
import "./index.css";

// Single QueryClient for the entire application
// Think of this as the cache for all server state
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* BrowserRouter — enables <Route>, <Link>, useNavigate, etc. */}
    <BrowserRouter>
      {/* QueryClientProvider — makes useQuery / useMutation available everywhere */}
      <QueryClientProvider client={queryClient}>
        {/* AuthProvider — makes token, login(), logout(), isAuthenticated available everywhere */}
        <AuthProvider>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                borderRadius: "12px",
                background: "#1a1a2e",
                color: "#fff",
                fontSize: "0.88rem",
                fontWeight: "500",
              },
              success: { iconTheme: { primary: "#10b981", secondary: "#fff" } },
              error:   { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
            }}
          />
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
