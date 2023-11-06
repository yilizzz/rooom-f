'use client';
import { logIn, logOut } from '@/api/user';
import { createContext, useState } from 'react';

export const UserContext = createContext();

export default function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [newUser, setNewUser] = useState(false);

  const login = async userData => {
    const { username } = userData;
    console.log('context', username);
    const res = await logIn(userData);

    if (res) {
      if (res === 201) {
        setNewUser(true);
      }
      setUser(username);
    }
  };

  const logout = async () => {
    const res = await logOut();
    if (res) {
      setUser(null);
    }
  };

  return (
    <UserContext.Provider value={{ user, newUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}
