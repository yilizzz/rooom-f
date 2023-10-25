import Link from 'next/link';
import React, { useState, useContext } from 'react';
import { CascadeSelect } from 'primereact/cascadeselect';
import { CityContext } from '@/utils/context/city';
import styles from './Nav.module.css';

import cityData from '@/utils/service/citydata';

const Nav = ({ selectFlag }) => {
  const { city, setCity } = useContext(CityContext);

  const [selectedCity, setSelectedCity] = useState(null);

  return (
    <>
      <nav className={styles.container}>
        <Link href="/">Home</Link>
        <Link href="/account">Account</Link>
        <Link href="/map">Map</Link>
        {selectFlag ? (
          <div className="card flex justify-content-center">
            <CascadeSelect
              value={city}
              onChange={e => {
                setSelectedCity(e.value);
                setCity(e.value);
              }}
              options={cityData}
              optionLabel="cname"
              optionGroupLabel="name"
              optionGroupChildren={['departement', 'cities']}
              breakpoint="767px"
              placeholder="Select a City"
              style={{ width: '10rem' }}
            />
          </div>
        ) : null}
      </nav>
    </>
  );
};
export default Nav;
