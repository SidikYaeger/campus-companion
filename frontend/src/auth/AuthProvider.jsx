import { useCallback, useEffect, useState } from "react";
import api from "../api/axiosConfig";
import AuthContext from "./authContext";

const tokenKey = "campus_companion_token";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearSession = useCallback(() => {
    localStorage.removeItem(tokenKey);
    setUser(null);
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => clearSession();
    window.addEventListener("campus-companion:unauthorized", handleUnauthorized);

    async function restoreSession() {
      if (!localStorage.getItem(tokenKey)) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/auth/me");
        setUser(response.data);
      } catch {
        clearSession();
      } finally {
        setLoading(false);
      }
    }

    restoreSession();

    return () => {
      window.removeEventListener(
        "campus-companion:unauthorized",
        handleUnauthorized
      );
    };
  }, [clearSession]);

  const saveAuth = (data) => {
    localStorage.setItem(tokenKey, data.token);
    setUser(data);
  };

  const login = async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    saveAuth(response.data);
  };

  const register = async (details) => {
    const response = await api.post("/auth/register", details);
    saveAuth(response.data);
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      clearSession();
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
