// Since React context is not supported in Server Components,
// trying to create a context at the root of your application will cause an error
// To fix this, create your context and render its provider inside of a Client Component
'use client';

import { createContext, useState } from 'react';
import cityData from '../service/citydata';

export const CityContext = createContext({});

export default function CityProvider({ children }) {
  const [city, setCity] = useState({ cname: 'Troyes', code: '10000' });
  const getCityName = cityCode => {
    const selectedRegion = cityData.find(region =>
      region.departement.some(dept =>
        dept.cities.some(city => city.code === cityCode),
      ),
    );
    if (selectedRegion) {
      const city = selectedRegion.departement
        .flatMap(dept => dept.cities)
        .find(city => city.code === cityCode);
      if (city) {
        return city.cname;
      }
    }
    return null;
  };
  return (
    <CityContext.Provider value={{ city, setCity, getCityName }}>
      {children}
    </CityContext.Provider>
  );
}
