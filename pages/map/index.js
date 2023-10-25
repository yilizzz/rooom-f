import React, { useEffect, useContext, useState } from 'react';
import { CityContext } from '@/utils/context/city';
import styles from '@/styles/map.css';
import Nav from '@/app/components/Nav';
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
        console.log('Map page');
        console.log(res);
      }
    };

    fetchData();
  }, [city.code]);

  return (
    <div className={styles.container}>
      <Nav selectFlag={true} />
      {cityRooms.length > 0 ? (
        <div>
          <GMap cityRooms={cityRooms} />
        </div>
      ) : (
        <div>No data</div>
      )}
    </div>
  );
}
