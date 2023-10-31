import Link from 'next/link';
import React, { useState, useContext } from 'react';
import { CascadeSelect } from 'primereact/cascadeselect';
import { CityContext } from '@/utils/context/city';

import cityData from '@/utils/service/citydata';

const Nav = ({ selectFlag }) => {
  const { city, setCity } = useContext(CityContext);

  const [selectedCity, setSelectedCity] = useState(null);

  return (
    <>
      <nav
        style={{ backgroundColor: 'var(--cat-color)' }}
        className="flex flex-row align-items-center justify-content-end h-5rem w-full absolute left-0 top-0 z-5"
      >
        <Link
          className="no-underline font-semibold align-items-center justify-content-center navItem"
          href="/"
          cursor-pointer="true"
        >
          HOME
        </Link>
        <Link
          className="no-underline font-semibold align-items-center justify-content-center navItem"
          href="/map"
          cursor-pointer="true"
        >
          MAP
        </Link>
        <Link
          className="no-underline font-semibold align-items-center justify-content-center navItem"
          href="/account"
          cursor-pointer="true"
        >
          ACCOUNT
        </Link>

        {selectFlag ? (
          <div>
            <CascadeSelect
              className="text-xl font-medium align-items-center"
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
