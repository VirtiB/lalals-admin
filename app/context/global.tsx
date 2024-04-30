"use client";
import { createContext, useContext, useState } from "react";

interface GlobalContextProps {
  showSidebar: boolean;
  setShowSidebar: (show: boolean) => void;
  authStateSidebar: boolean;
  setAuthStateSidebar: (shows: boolean) => void;
  userDetails: any;
  setUserDetails: (value: any) => void;
}
const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

export const GlobalContextProvider = ({ children }: { children: any }) => {
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [authStateSidebar, setAuthStateSidebar] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<any>(null);

  const contextValue: GlobalContextProps = {
    showSidebar,
    setShowSidebar,
    authStateSidebar,
    setAuthStateSidebar,
    userDetails,
    setUserDetails,
  };

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
};
export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error(
      "useGlobalContext must be used within a GlobalContextProvider"
    );
  }
  return context;
};
