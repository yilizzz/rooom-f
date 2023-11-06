import 'primereact/resources/themes/lara-light-indigo/theme.css';

import { PrimeReactProvider } from 'primereact/api';
import '@/primereact-theme/theme.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import '@/styles/globals.css';

import CityProvider from '@/utils/context/city';
import UserProvider from '@/utils/context/user';
import Head from 'next/head';

export default function App({ Component, pageProps }) {
  return (
    <PrimeReactProvider>
      <UserProvider>
        <CityProvider>
          <Head>
            <link rel="icon" href="/favicon.png" />
            <title>My Rooom</title>
          </Head>
          <Component {...pageProps} />
        </CityProvider>
      </UserProvider>
    </PrimeReactProvider>
  );
}
