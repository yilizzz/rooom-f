'use client';

import { createContext, useContext, useState } from 'react';

export const UserContext = createContext();

export default function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  // UseEffect????????????????????????????????????????????????????????
  const login = async userData => {
    const response = await fetch('http://localhost:3001/login', {
      method: 'POST',
      body: JSON.stringify(userData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      setUser(userData.username);
    }
  };

  const logout = () => {
    // Logic to clear user information on logout
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

// export default function useUser = () => useContext(UserContext);
