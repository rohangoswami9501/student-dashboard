"use client";

import { createContext, useContext, ReactNode } from "react";

interface AppContextType {
  adminName: string;
}

const AppContext = createContext<AppContextType>({
  adminName: "Admin",
});

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <AppContext.Provider value={{ adminName: "Admin" }}>
      {children}
    </AppContext.Provider>
  );
}
export function useAppContext() {
  return useContext(AppContext);
}