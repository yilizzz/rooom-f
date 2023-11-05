import { UserContext } from '@/utils/context/user';
import React, { useState, useContext, useEffect, useRef } from 'react';
import Nav from '@/app/components/Nav';
import Footer from '@/app/components/Footer';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

import { InputText } from 'primereact/inputtext';
import { useRouter } from 'next/router';
import RoomTable from '@/app/components/RoomTable';
import { getPostRooms, getMarkedRooms } from '@/api/rooms';

function Account() {
  const { user, newUser, login, logout } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [postRooms, setPostRooms] = useState([]);
  const [markedRooms, setMarkedRooms] = useState([]);
  // Receive the signals when component RoomTable delete a listing in the mark list or post list
  const [refreshPage, setRefreshPage] = useState(false);

  const toastMessage = useRef(null);
  const showToast = (message, type) => {
    if (toastMessage.current) {
      toastMessage.current.show({
        severity: type,
        summary: type.charAt(0).toUpperCase() + type.slice(1),
        detail: message,
        life: 2000,
      });
    }
  };

  const handleLogin = () => {
    if (username != '' && password != '') {
      login({ username, password });
    } else {
      showToast('Need a username.', 'error');
    }
  };
  const handleLogout = () => {
    logout();
  };

  const router = useRouter();
  const onPostRoom = () => {
    router.push({
      pathname: '/post',
      query: { mode: 'add' },
    });
  };
  // useEffect must not return anything besides a function, which is used for clean-up.
  // Instead of using useEffect(async () => ...) or returned a Promise,
  // write the async function inside the effect and call it immediately:
  useEffect(() => {
    async function fetchData() {
      if (user) {
        const resMark = await getMarkedRooms(user);
        setMarkedRooms(resMark);
        const resPost = await getPostRooms(user);
        setPostRooms(resPost);
      }
    }
    fetchData();
  }, [user, refreshPage]);

  useEffect(() => {
    if (newUser) {
      setTimeout(() => {
        fetchData();
      }, 500);
    }
  }, [newUser]);

  return (
    <div className="flex flex-column justify-content-center align-items-center h-screen w-screen relative">
      <Nav selectFlag={false} />
      <Toast ref={toastMessage} position="center" />
      {user ? (
        <div className="flex flex-column align-self-center justify-content-start my-8 py-4 ml-8 overflow-auto">
          <div className="my-4 flex justify-content-between">
            <h1 className="text-orange-700">Hello, {user}!</h1>

            <div className="card flex justify-content-center">
              <Button
                label="Post A Room"
                icon="pi pi-file-edit"
                onClick={() => onPostRoom()}
              />
            </div>
            <div className="card flex justify-content-center mr-8">
              <Button
                label="Logout"
                icon="pi pi-sign-out"
                onClick={() => handleLogout()}
              />
            </div>
          </div>

          <div className="h-auto">
            <h2 className="text-blue-900">My rooms marked</h2>
            <RoomTable
              data={markedRooms}
              isMark={true}
              refreshPage={() => setRefreshPage(true)}
            />
          </div>

          <div className="h-auto">
            <h2 className="text-blue-900">My rooms posted</h2>
            <RoomTable
              data={postRooms}
              isMark={false}
              refreshPage={() => setRefreshPage(true)}
            />
          </div>
        </div>
      ) : (
        <div className=" flex flex-column align-self-center justify-content-evenly h-20rem w-30rem">
          {/* <div className=""> */}
          <h2 className="text-blue-900">LOG IN</h2>
          <InputText
            placeholder="a"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <InputText
            placeholder="a"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <Button
            className="w-8rem flex align-self-end bg-blue-900"
            label="Login"
            icon="pi pi-external-link"
            onClick={() => handleLogin()}
          />
        </div>

        // </div>
      )}
      <Footer />
    </div>
  );
}
export default Account;
