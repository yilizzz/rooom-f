import 'primereact/resources/themes/lara-light-indigo/theme.css';

import { PrimeReactProvider } from 'primereact/api';
import '@/primereact-theme/theme.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // theme
import 'primeflex/primeflex.css'; // css utility
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import '@/styles/globals.css';

import CityProvider from '@/utils/context/city';
import UserProvider from '@/utils/context/user';

export default function App({ Component, pageProps }) {
  return (
    <PrimeReactProvider>
      <UserProvider>
        <CityProvider>
          <Component {...pageProps} />
        </CityProvider>
      </UserProvider>
    </PrimeReactProvider>
  );
}
