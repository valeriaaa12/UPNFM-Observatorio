// src/context/usertype.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  uid: string;
  email: string;
  admin: boolean;
}

interface UserContextValue {
  user: User | null;
  setUser: (u: User | null) => void;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return ctx;
}
