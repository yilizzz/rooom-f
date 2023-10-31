import { useRouter } from 'next/router';
import { useContext, useState, useEffect } from 'react';

import Nav from '@/app/components/Nav';
import Footer from '@/app/components/Footer';
import { Galleria } from 'primereact/galleria';
import { UserContext } from '@/utils/context/user';
import { CityContext } from '@/utils/context/city';
import { Card } from 'primereact/card';
import Link from 'next/link';
import { Button } from 'primereact/button';
import { markRoom } from '@/api/rooms';

export default function Details() {
  const { user } = useContext(UserContext);
  const { getCityName } = useContext(CityContext);
  const router = useRouter();
  const mode = router.query.mode;
  const [images, setImages] = useState([]);
  const [room, setRoom] = useState({});

  const initializeRoom = room => {
    setRoom(room);
    if (room.url && room.url.length > 0) {
      const array = room.url.map((url, index) => ({
        itemImageSrc: url,
        alt: room.title,
      }));
      setImages(array);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undifined') {
      const detailData = localStorage.getItem('detailData');
      localStorage.removeItem('detailData');

      const parsedRoom = JSON.parse(detailData);
      initializeRoom(parsedRoom);
    }
  }, []);
  const itemTemplate = item => {
    return (
      <img
        src={item.itemImageSrc}
        alt={item.alt}
        style={{ width: '100%', display: 'block', borderRadius: '20px' }}
      />
    );
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
  const onLogin = () => {
    router.push({
      pathname: '/account',
    });
  };
  return (
    <div className="flex flex-column justify-content-center align-items-center h-screen w-screen relative">
      <Nav selectFlag={false} />
      <div className="flex align-self-center justify-content-evenly w-full py-8 my-8 ">
        <div className="flex flex-column gap-4 w-4">
          <h1>{room.title}</h1>
          {user ? (
            mode == 'fromMarkPage' ? null : (
              <Button
                className="w-6rem flex justify-content-center"
                severity="info"
                onClick={() => onMarkRoom(user, room.id)}
              >
                Mark
              </Button>
            )
          ) : (
            <Button
              className="w-10rem flex justify-content-center"
              severity="info"
              onClick={() => onLogin()}
            >
              Login to mark
            </Button>
          )}
          <div
            className="card shadow-1 flex flex-column"
            style={{ color: 'var(--primary-color)', borderLeft: '4px solid' }}
          >
            <div className="grid mt-3">
              <div className="col-3 flex flex-column p-3 text-center surface-border">
                <span className="text-color text-2xl font-semibold">
                  {room.price}
                </span>
                <span className="text-color font-semibold">Euros</span>
              </div>
              <div className="col-3 flex flex-column p-3 text-center ">
                <span className="text-color text-2xl font-semibold">
                  {room.number}
                </span>
                <span className="text-color font-semibold">rooms</span>
              </div>
              <div className="col-3 flex flex-column p-3 text-center ">
                <span className="text-color text-2xl font-semibold">
                  {room.floor}
                </span>
                <span className="text-color font-semibold">floor</span>
              </div>
              <div className="col-3 flex flex-column p-3 text-center ">
                <span className="text-color text-2xl font-semibold">
                  {room.area}
                </span>
                <span className="text-color font-semibold">m2</span>
              </div>
            </div>
          </div>

          <Card title="Address" className="h-8rem">
            <p className="m-0">
              {room.address} {getCityName(room.city)}({room.city})
            </p>
          </Card>
          <Card title="Contact" className="h-8rem">
            <p className="m-0">{room.contact}</p>
          </Card>
        </div>
        <div className="flex justify-content-center align-items-center w-5">
          {room.url && room.url.length > 0 ? (
            <div className="card">
              <Galleria
                value={images}
                style={{ maxWidth: '640px' }}
                showThumbnails={false}
                showIndicators
                changeItemOnIndicatorHover
                item={itemTemplate}
              />
            </div>
          ) : (
            <p className="align-self-center">No Images Yet</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
