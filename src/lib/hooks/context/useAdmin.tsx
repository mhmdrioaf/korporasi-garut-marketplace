"use client";

import NoAccess from "@/components/ui/no-access";
import { ReactNode, createContext } from "react";

interface IAdminProviderProps {
  isAllowed: boolean;
  children: ReactNode;
}

export const AdminContext = createContext<TAdminContextType | null>(null);

export function AdminProvider({ isAllowed, children }: IAdminProviderProps) {
  return isAllowed ? (
    <AdminContext.Provider value={{ test: "" }}>
      {children}
    </AdminContext.Provider>
  ) : (
    <NoAccess />
  );
}
