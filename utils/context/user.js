'use client';
import { logIn, logOut } from '@/api/user';
import { createContext, useState } from 'react';

export const UserContext = createContext();

export default function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [newUser, setNewUser] = useState(false);

  const login = userData => {
    const res = logIn(userData);
    if (res) {
      if (res === 201) {
        setNewUser(true);
      }
      setUser(userData.username);
    }
  };

  const logout = () => {
    if (logOut()) {
      setUser(null);
    }
  };

  return (
    <UserContext.Provider value={{ user, newUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}
