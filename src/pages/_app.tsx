import "@/styles/globals.css";
import "@/styles/styles.css";
import '@/styles/uploadExcel.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import type { AppProps } from "next/app";
import { I18nextProvider } from 'react-i18next';
import { CookiesProvider } from 'react-cookie';
import { UserProvider } from '@/context/usertype';
import i18n from "@/translations/i18n";
import { appWithTranslation } from 'next-i18next';

function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
    <CookiesProvider>
      <I18nextProvider i18n={i18n}>
        <UserProvider>
          <Component {...pageProps} />
        </UserProvider>
      </I18nextProvider>
    </CookiesProvider>
    </UserProvider>
  );
}

export default appWithTranslation(App);

