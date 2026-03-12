import { createContext, useState, useEffect, useMemo } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const getStoredUser = () => {
    try {
      const stored = localStorage.getItem("userInfo");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };
 // User state initialize ho raha hai stored data se

  const [user, setUser] = useState(getStoredUser);
// Login function: user data set karta hai aur localStorage mein save karta hai
 
  const login = (data) => {
    const userData = {
      _id: data._id,
      name: data.name,
      email: data.email,
      isAdmin: data.isAdmin || false,
      token: data.token,
    };

    localStorage.setItem("userInfo", JSON.stringify(userData));
    setUser(userData);
  };
// Logout function: localStorage clear karta hai aur user ko null set karta hai
 
  const logout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
  };

  // Sync logout/login across tabs
  // Multiple tabs mein sync ke liye storage event listener

  useEffect(() => {
    const handleStorageChange = () => {
      setUser(getStoredUser());
    };

    window.addEventListener("storage", handleStorageChange);
    return () =>
      window.removeEventListener("storage", handleStorageChange);
  }, []);
// Memoized value taaki unnecessary re-renders na ho

  const value = useMemo(
    () => ({
      user,
      isAdmin: user?.isAdmin || false,
      login,
      logout,
    }),
    [user]
  );
// Context provider jo children ko value provide karta hai

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};