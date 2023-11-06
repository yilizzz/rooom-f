import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState, useContext } from 'react';
import { Button } from 'primereact/button';
import { CascadeSelect } from 'primereact/cascadeselect';
import Image from 'next/image';
import { CityContext } from '@/utils/context/city';
import { UserContext } from '@/utils/context/user';

import cityData from '@/utils/service/citydata';

const Nav = ({ selectFlag }) => {
  const { city, setCity } = useContext(CityContext);
  const { user } = useContext(UserContext);
  const [selectedCity, setSelectedCity] = useState(null);
  const router = useRouter();
  const onLogin = () => {
    router.push({
      pathname: '/login',
    });
  };

  return (
    <>
      <nav
        style={{ backgroundColor: 'var(--primary-color)' }}
        className="flex flex-row align-items-center justify-content-end h-4rem w-full absolute left-0 top-0 z-5"
      >
        <Link
          className="navItem absolute left-0 text-orange-700"
          href="/"
          cursor-pointer="true"
        >
          MY ROOOM
          <Image
            src="/favicon.png"
            alt="My Rooom"
            width="40"
            height="40"
          ></Image>
        </Link>
        {user ? null : (
          <Button
            icon="pi pi-power-off"
            className="p-button-success p-button-rounded bg-blue-900 w-2rem h-2rem"
            onClick={() => onLogin()}
          />
        )}
        <Link
          className="navItem text-orange-700"
          href="/map"
          cursor-pointer="true"
        >
          MAP
        </Link>
        {user ? (
          <Link
            className="navItem text-orange-700"
            href="/account"
            cursor-pointer="true"
          >
            ACCOUNT
          </Link>
        ) : null}

        {selectFlag ? (
          <div>
            <CascadeSelect
              className="align-items-center bg-primary text-xl font-bold "
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
