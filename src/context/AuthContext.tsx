import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { logoutUser, getCurrentUser} from "../Api";

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<string | null>(null);

  // Simulasi login, bisa digunakan setelah loginUser dipanggil
  const login = (username: string) => {
    setIsAuthenticated(true);
    setUser(username);
  };

  const logout = async () => {
    try {
      const response = await logoutUser();
      setIsAuthenticated(false);
      setUser(null);
      console.log(response.message); // Tampilkan pesan logout jika perlu
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  // Cek login status dari server saat pertama kali app dijalankan
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        setIsAuthenticated(true);
        setUser(user.username);
      } catch (err) {
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
  
    checkAuth();
  }, []);

  if (loading) {
    return <div></div>; // Atau spinner
  }

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
