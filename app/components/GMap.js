import {
  GoogleMap,
  MarkerF,
  useLoadScript,
  InfoWindow,
} from '@react-google-maps/api';
import React, { useContext, useState, useRef } from 'react';
import { UserContext } from '@/utils/context/user';
import { Button } from 'primereact/button';
import { Image } from 'primereact/image';
import { Toast } from 'primereact/toast';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { markRoom } from '@/api/rooms';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const GMap = ({ cityRooms }) => {
  const { user, login } = useContext(UserContext);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY,
  });

  const center = cityRooms[0].location;
  const url = '/cat-footprint-32.png';

  const [activeMarker, setActiveMarker] = useState(null);

  const handleActiveMarker = marker => {
    if (marker === activeMarker) {
      return;
    }
    setActiveMarker(marker);
  };
  const toastMessage = useRef(null);

  const showToast = (message, type) => {
    toastMessage.current.show({
      severity: type,
      summary: type.charAt(0).toUpperCase() + type.slice(1),
      detail: message,
      life: 2000,
    });
  };
  const onMarkRoom = async (user, id) => {
    const res = await markRoom(user, id);
    if (res) {
      if (res === 200) {
        showToast('Marked a room', 'success');
      } else {
        showToast('Marked this room already', 'info');
      }
    } else {
      showToast('Mark room failed', 'error');
    }
  };
  const router = useRouter();

  const onDetails = room => {
    localStorage.setItem('detailData', JSON.stringify(room));
    router.push({
      pathname: '/details',
      query: { mode: 'fromMapPage' },
    });
  };
  return (
    <div style={{ width: '100vw', height: '75vh', padding: '1rem auto' }}>
      <Toast ref={toastMessage} position="center" />
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={14}
          gestureHandling="cooperative"
        >
          {cityRooms.map((room, index) => (
            <React.Fragment key={index}>
              <MarkerF
                position={room.location}
                icon={url}
                onMouseOver={() => handleActiveMarker(index)}
                onMouseLeave={() => setActiveMarker(null)}
              />
              {activeMarker === index ? (
                <InfoWindow
                  position={room.location}
                  onCloseClick={() => setActiveMarker(null)}
                >
                  <div className="flex flex-column justify-content-center align-item-center m-2 gap-3">
                    <div className="text-xl flex align-self-center text-blue-900">
                      {room.title}
                    </div>
                    <div className="flex align-self-center">
                      {room.url.length > 0 ? (
                        <Image
                          src={room.url[0]}
                          zoomSrc={room.url[0]}
                          alt="Image"
                          width="320"
                          height="240"
                          preview
                        />
                      ) : (
                        <p>No Image Yet</p>
                      )}
                    </div>
                    <Button
                      className="align-self-center h-2rem"
                      severity="info"
                      onClick={() => onDetails(room)}
                    >
                      Details
                    </Button>
                    <div className="text-l flex align-self-center">
                      {user ? (
                        <Button
                          severity="info"
                          onClick={() => onMarkRoom(user, room.id)}
                        >
                          Mark
                        </Button>
                      ) : (
                        <Link className="no-underline" href="/account">
                          Login to mark
                        </Link>
                      )}
                    </div>
                  </div>
                </InfoWindow>
              ) : null}
            </React.Fragment>
          ))}
        </GoogleMap>
      ) : (
        <div>loading...</div>
      )}
    </div>
  );
};

export default GMap;
