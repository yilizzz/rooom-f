import { UserContext } from '@/utils/context/user';
import React, { useState, useContext, useEffect, useRef } from 'react';
import Nav from '@/app/components/Nav';
import Footer from '@/app/components/Footer';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useRouter } from 'next/router';
import RoomTable from '@/app/components/RoomTable';
import { getPostRooms, getMarkedRooms } from '@/api/rooms';
import { useLoading } from '@/utils/context/loading';

function Account() {
  const { user, logout } = useContext(UserContext);
  const [postRooms, setPostRooms] = useState([]);
  const [markedRooms, setMarkedRooms] = useState([]);
  // Receive the signals when component RoomTable delete a listing from the mark list or post list
  const [refreshPage, setRefreshPage] = useState(false);
  const { loading, startLoading, stopLoading } = useLoading();

  const toastMessage = useRef(null);
  const router = useRouter();
  // The parameter passed from the post page to mark changes in the user's post data.
  const [mode, setMode] = useState(
    router.query.mode ? router.query.mode : null,
  );

  const handleLogout = async () => {
    await logout();
    router.push({
      pathname: '/',
    });
  };

  const onPostRoom = () => {
    router.push({
      pathname: '/post',
      query: { mode: 'add' },
    });
  };

  useEffect(() => {
    async function fetchData(user) {
      if (user) {
        const resMark = await getMarkedRooms(user);
        console.log('fetchData', resMark);
        setMarkedRooms(resMark);
        const resPost = await getPostRooms(user);
        setPostRooms(resPost);
      }
    }
    // If user post or edit a listing, re-render
    if (mode) {
      setMode(null);
      fetchData(user);
      // If user delete a listing, re-render
    } else if (refreshPage) {
      setRefreshPage(false);
      startLoading();
      setTimeout(() => {
        fetchData(user);
        stopLoading();
      }, 1000);
    } else {
      fetchData(user);
    }
  }, [user, mode, refreshPage]);

  return (
    <div className="flex flex-column justify-content-center align-items-center h-screen w-screen relative">
      <Nav selectFlag={false} />
      <Toast ref={toastMessage} position="center" />
      {loading ? <ProgressSpinner id="spinner" /> : null}
      <div className="flex flex-column align-self-center justify-content-start my-8 py-4 ml-8 overflow-auto">
        <div className="my-4 flex justify-content-between">
          <h1 className="text-orange-700">Hello, {user}!</h1>

          <div className="card flex justify-content-center">
            <Button
              label="Post A Room"
              icon="pi pi-file-edit"
              onClick={() => onPostRoom()}
              disabled={loading}
            />
          </div>
          <div className="card flex justify-content-center mr-8">
            <Button
              label="Logout"
              icon="pi pi-sign-out"
              onClick={() => handleLogout()}
              disabled={loading}
            />
          </div>
        </div>

        <div className="h-auto">
          <h2 className="text-blue-900">My rooms marked</h2>
          <RoomTable
            data={markedRooms}
            isMark={true}
            refreshPage={() => setRefreshPage(true)}
            buttonsDisabled={loading}
          />
        </div>

        <div className="h-auto">
          <h2 className="text-blue-900">My rooms posted</h2>
          <RoomTable
            data={postRooms}
            isMark={false}
            refreshPage={() => setRefreshPage(true)}
            buttonsDisabled={loading}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}
export default Account;
