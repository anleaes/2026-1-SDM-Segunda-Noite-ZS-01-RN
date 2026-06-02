import React, { createContext, useContext, useState, ReactNode } from 'react';

type UserTipo = 'cliente' | 'administrador' | 'guest';

type AuthUser = {
  tipo: UserTipo;
  nome?: string;
  email?: string;
  token?: string;
};

type AuthContextValue = {
  user: AuthUser;
  setUser: (user: AuthUser) => void;
  logout: () => void;
};

const defaultUser: AuthUser = { tipo: 'guest' };

const AuthContext = createContext<AuthContextValue>({
  user: defaultUser,
  setUser: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser>(defaultUser);

  const logout = () => {
    setUser(defaultUser);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
