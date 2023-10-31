import {
  GoogleMap,
  MarkerF,
  useLoadScript,
  InfoWindow,
} from '@react-google-maps/api';
// import styles from './GMap.module.css';
import React, { useContext, useState } from 'react';
import { UserContext } from '@/utils/context/user';
import { Button } from 'primereact/button';
import { Image } from 'primereact/image';
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
  const onMarkRoom = async (user, id) => {
    const res = await markRoom(user, id);
    if (res) {
      if (res === 200) alert('mark a room');
      else alert('marked already');
    } else {
      alert('failed');
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
    <div style={{ width: '80vw', height: '70vh', margin: '2rem auto' }}>
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={13}
          gestureHandling="cooperative"
        >
          {cityRooms.map((room, index) => (
            <React.Fragment key={index}>
              <MarkerF
                position={room.location}
                icon={url}
                onClick={() => handleActiveMarker(index)}
              />
              {activeMarker === index ? (
                <InfoWindow
                  position={room.location}
                  onCloseClick={() => setActiveMarker(null)}
                >
                  <div className="flex flex-column justify-content-center align-item-center m-2 gap-3">
                    <div className="text-xl flex align-self-center">
                      {room.title}
                    </div>
                    <div className="flex align-self-center">
                      <Image
                        src={room.url[0]}
                        zoomSrc={room.url[0]}
                        alt="Image"
                        width="320"
                        height="240"
                        preview
                      />
                    </div>
                    <Button
                      className="align-self-center"
                      severity="info"
                      onClick={() => onDetails(room)}
                    >
                      Details
                    </Button>
                    <div className="text-xl flex align-self-center">
                      {user ? (
                        <Button
                          severity="info"
                          onClick={() => onMarkRoom(user, room.id)}
                        >
                          Mark
                        </Button>
                      ) : (
                        // <Button severity="info" onClick={onLogin}>
                        //   Login to mark
                        // </Button>
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
