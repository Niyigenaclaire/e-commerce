// src/context/AuthContext.jsx
// Central authentication state — shared across the entire application
import { createContext, useContext, useState } from "react";

// 1. Create the context
const AuthContext = createContext();

/**
 * AuthProvider wraps the whole app and makes auth state available everywhere.
 * It stores:
 *   - token          : the JWT access token (string)
 *   - login()        : saves token to state + localStorage
 *   - logout()       : clears token from state + localStorage
 *   - isAuthenticated: boolean derived from whether a token exists
 */
export function AuthProvider({ children }) {
  // Initialize token from localStorage so sessions survive page refreshes
  const [token, setToken] = useState(
    localStorage.getItem("token") || ""
  );

  /** Called after a successful login — saves token everywhere */
  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  /** Called when user clicks Logout — wipes token from everywhere */
  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        logout,
        // !! converts any truthy string to true, empty string to false
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth — custom hook for consuming AuthContext.
 * Usage in any component:
 *   const { token, login, logout, isAuthenticated } = useAuth();
 */
export function useAuth() {
  return useContext(AuthContext);
}
