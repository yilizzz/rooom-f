import React, { useContext, useRef } from 'react';
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import { Toast } from 'primereact/toast';
import { useRouter } from 'next/router';
import { UserContext } from '@/utils/context/user';
import { CityContext } from '@/utils/context/city';
import { deleteMark, deletePost } from '@/api/rooms';

export default function PostTable({ data, isMark, refreshPage }) {
  const toastMessage = useRef(null);
  const { user } = useContext(UserContext);
  const { getCityName } = useContext(CityContext);
  const router = useRouter();
  const showToast = (message, type) => {
    if (toastMessage.current) {
      toastMessage.current.show({
        severity: type,
        summary: type.charAt(0).toUpperCase() + type.slice(1),
        detail: message,
        life: 3000,
      });
    }
  };
  const onEditRoom = room => {
    localStorage.setItem('roomData', JSON.stringify(room));
    router.push({
      pathname: '/post',
      query: { mode: 'edit' },
    });
  };
  const onDetailRoom = room => {
    localStorage.setItem('detailData', JSON.stringify(room));
    router.push({
      pathname: '/details',
      query: { mode: 'fromMarkPage' },
    });
  };
  const onDeleteRoom = async id => {
    let deleted = false;
    if (isMark) {
      deleted = await deleteMark(user, id);
      console.log('delete');
    } else {
      deleted = await deletePost(user, id);
    }
    if (deleted) {
      refreshPage();
    } else {
      showToast(
        isMark ? 'Unmark a room failed' : 'Delete a post failed',
        'error',
      );
    }
  };
  const itemTemplate = room => {
    return (
      <div className="col-12">
        <div
          className="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4"
          key={room.id}
        >
          <Toast ref={toastMessage} position="center" />
          {room.url.length > 0 ? (
            <img
              className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round"
              src={room.url[0]}
              alt={room.title}
            />
          ) : (
            <img
              className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round"
              src="/catbox.jpg"
              alt={room.title}
            />
          )}

          <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
            <div className="flex flex-column align-items-center sm:align-items-start gap-3">
              <div className="text-2xl font-bold text-900 text-primary">
                {room.title}
              </div>
              <span className="text-xl font-semibold">
                {getCityName(room.city)}
              </span>
              <span className="text-xl font-semibold text-primary">
                {room.price}€
              </span>
            </div>
            <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
              {isMark ? (
                <Button
                  icon="pi pi-search-plus"
                  className="p-button-rounded"
                  onClick={() => onDetailRoom(room)}
                ></Button>
              ) : (
                <Button
                  icon="pi pi-wrench"
                  className="p-button-rounded"
                  onClick={() => onEditRoom(room)}
                ></Button>
              )}
              <Button
                icon="pi pi-times"
                className="p-button-rounded"
                onClick={() => onDeleteRoom(room.id)}
              ></Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="card m-8">
      <DataView value={data} itemTemplate={itemTemplate} />
    </div>
  );
}
