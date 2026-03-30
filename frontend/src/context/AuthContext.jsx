import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("fp_user");
    return saved ? JSON.parse(saved) : null;
  });

  const isAuthenticated = !!user;

  useEffect(() => {
    if (user) {
      localStorage.setItem("fp_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("fp_user");
    }
  }, [user]);

  const login = (email, password) => {
    // Mock authentication — replace with real API later
    if (!email || !password) return { success: false, message: "All fields are required" };
    setUser({ email, name: email.split("@")[0] });
    return { success: true };
  };

  const signup = (name, email, password) => {
    if (!name || !email || !password) return { success: false, message: "All fields are required" };
    setUser({ email, name });
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
