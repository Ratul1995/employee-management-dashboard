import { createContext, useContext, useState } from "react";

interface AuthcontextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const Authcontext = createContext<AuthcontextType | null>(null);

const AuthFunction = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setisAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  const login = (token: string) => {
    localStorage.setItem("token", token);
    setisAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token"); // Fixed: removed "token" key correctly
    setisAuthenticated(false);
  };

  return (
    <Authcontext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </Authcontext.Provider>
  );
};

export const UseAuth = () => {
  return useContext(Authcontext)!;
};

export default AuthFunction;