import React, { useEffect, useContext, useState } from 'react';
import { CityContext } from '@/utils/context/city';
import Nav from '@/app/components/Nav';
import Footer from '@/app/components/Footer';
import GMap from '@/app/components/GMap';
import { getCityRooms } from '@/api/rooms';

export default function Map() {
  const { city, setCity } = useContext(CityContext);
  const [cityRooms, setCityRooms] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getCityRooms(city.code);
      if (res) {
        setCityRooms(res);
      }
    };

    fetchData();
  }, [city.code]);

  return (
    <div className="flex flex-column justify-content-center align-items-center h-screen w-screen relative">
      <Nav selectFlag={true} />

      {cityRooms.length > 0 ? (
        <div>
          <GMap cityRooms={cityRooms} />
        </div>
      ) : (
        <div className="align-self-center">No Data Yet</div>
      )}

      <Footer />
    </div>
  );
}
