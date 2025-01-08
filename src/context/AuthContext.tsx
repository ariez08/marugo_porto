import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextProps {
  isAuthenticated: boolean;
  user: string | null;
  login: (username: string) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Retrieve authentication state from localStorage
    return localStorage.getItem("isAuthenticated") === "true";
  });

  const [user, setUser] = useState<string | null>(() => {
    // Retrieve the user from localStorage
    return localStorage.getItem("user");
  });

  const login = (username: string) => {
    setIsAuthenticated(true);
    setUser(username);
    // Save to localStorage
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("user", username);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    // Remove from localStorage
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
  };

  useEffect(() => {
    console.log("Auth state updated:", { isAuthenticated, user });
  }, [isAuthenticated, user]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
