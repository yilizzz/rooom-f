import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import { CityContext } from '@/utils/context/city';
import { Button } from 'primereact/button';
import { Carousel } from 'primereact/carousel';

export default function Circular({ rooms }) {
  const { getCityName } = useContext(CityContext);
  const router = useRouter();
  const responsiveOptions = [
    {
      breakpoint: '1199px',
      numVisible: 2,
      numScroll: 1,
    },
    // {
    //   breakpoint: '991px',
    //   numVisible: 2,
    //   numScroll: 1,
    // },
    {
      breakpoint: '767px',
      numVisible: 1,
      numScroll: 1,
    },
  ];
  const onDetails = room => {
    localStorage.setItem('detailData', JSON.stringify(room));
    router.push({
      pathname: '/details',
      query: { mode: 'fromMapPage' },
    });
  };
  const productTemplate = room => {
    return (
      <div className=" m-1 text-center py-1 px-1">
        <div className="mb-2">
          {room.url[0] ? (
            <img
              src={room.url[0]}
              alt={room.title}
              className="w-9 shadow-2 border-round"
            />
          ) : (
            <img
              src="/catbox.jpg"
              alt="My Rooom"
              className="w-9 shadow-2 border-round"
            />
          )}
        </div>
        <div className="flex flex-column flex-wrap gap-1 justify-content-evenly align-item-center py-3 px-2">
          <div className="my-3">
            <Button
              icon="pi pi-search"
              className="p-button-success p-button-rounded bg-primary"
              onClick={() => onDetails(room)}
            />
          </div>
          <div className="flex flex-column justify-content-evenly align-item-center my-3 ">
            <h3 className="flex align-self-center flex-wrap mb-1 text-blue-900">
              {room.title}
            </h3>
            <h4 className="flex align-self-center flex-wrap mt-0 mb-3 text-primary">{`${
              room.address
            }, ${getCityName(room.city)}`}</h4>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{ minHeight: '60vh', overflow: 'auto' }}
      className="card w-11 bg-gray-300 p-8  "
    >
      <Carousel
        value={rooms}
        numVisible={3}
        numScroll={3}
        responsiveOptions={responsiveOptions}
        autoplayInterval={5000}
        itemTemplate={productTemplate}
      />
    </div>
  );
}
