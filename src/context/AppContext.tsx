"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AuthUser } from "@/types/auth";

interface AppContextType {
  adminName: string;
  darkMode: boolean;
  toggleDarkMode: () => void;
  logout: () => void;
  user: AuthUser | null;
}

const AppContext = createContext<AppContextType>({
  adminName: "Admin",
  darkMode: false,
  toggleDarkMode: () => {},
  logout: () => {},
  user: null,
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);//SSR safe — there is no localstorage on server,that's why we use default values

  useEffect(() => {
    const stored = localStorage.getItem("darkMode");
    if (stored === "true") setDarkMode(true);

    const authUser = localStorage.getItem("authUser");
    if (authUser) setUser(JSON.parse(authUser));
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      localStorage.setItem("darkMode", String(!prev));
      return !prev;
    });
  };

  const logout = () => {
    localStorage.removeItem("authUser");
    setUser(null);
    //used window..rather than router.push,because need hard redirect,page reload neccessary
    window.location.href = "/";
  };

  return (
    <AppContext.Provider value={{ adminName: user?.name?? "Admin", darkMode, toggleDarkMode, logout, user }}>
      {children}
    </AppContext.Provider>
  );
}

//custom created
export function useAppContext() {
  return useContext(AppContext);
}