import { UserContext } from '@/utils/context/user';
import React, { useState, useContext } from 'react';
import Nav from '@/app/components/Nav';
import { Button } from 'primereact/button';
import { useRouter } from 'next/router';

function Account() {
  const { user, login, logout } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Perform login and set user information using the login function
    login({ username, password });
  };

  const handleLogout = () => {
    // Perform logout and clear user information using the logout function
    logout();
  };

  const router = useRouter();

  const onPostRoom = user => {
    router.push({
      pathname: '/post', // 目标页面的路径
    });
  };

  return (
    <div>
      <Nav selectFlag={false} />
      {user ? (
        <div>
          <p>Welcome, {user}!</p>
          <button onClick={handleLogout}>Logout</button>
          <div className="card flex justify-content-center">
            <Button
              label="Post A Room"
              icon="pi pi-external-link"
              onClick={() => onPostRoom()}
            />
          </div>
          <div>
            <h2>My rooms marked</h2>
            <div>list</div>
          </div>
        </div>
      ) : (
        <div>
          <p>Please log in.</p>
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
          </div>
        </div>
      )}
    </div>
  );
}
export default Account;
