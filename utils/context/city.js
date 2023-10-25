// Since React context is not supported in Server Components,
// trying to create a context at the root of your application will cause an error
// To fix this, create your context and render its provider inside of a Client Component
'use client';

import { createContext, useState } from 'react';

export const CityContext = createContext({});

export default function CityProvider({ children }) {
  const [city, setCity] = useState({ cname: 'Troyes', code: '10000' });
  return (
    <CityContext.Provider value={{ city, setCity }}>
      {children}
    </CityContext.Provider>
  );
}
