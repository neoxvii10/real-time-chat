import React, { createContext, useContext, useState } from 'react';

type AuthContextType = {
  isLoggedIn: boolean;
  handleLogin: (token: any) => void;
  handleLogout: () => void;
};

type AuthProviderProps = {
  children: React.ReactNode;
};

 const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  handleLogin: (token: any) => {},
  handleLogout: () => {}
 });

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("accessToken") !== null
  );

  const handleLogin = (token: any) => {
    localStorage.setItem('accessToken', JSON.stringify(token));
    setIsLoggedIn(true);
  }

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false);
  }

  return (
    <AuthContext.Provider value={{isLoggedIn, handleLogin, handleLogout}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
}