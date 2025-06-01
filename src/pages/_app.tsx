import "@/styles/globals.css";
import "@/styles/styles.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import type { AppProps } from "next/app";
import { I18nextProvider } from 'react-i18next';
import { CookiesProvider } from 'react-cookie'; 
import i18n from "@/translations/i18n";
import { appWithTranslation } from 'next-i18next';

function App({ Component, pageProps }: AppProps) {
  return (
    <CookiesProvider> 
      <I18nextProvider i18n={i18n}>
        <Component {...pageProps} />
      </I18nextProvider>
    </CookiesProvider>
  );
}

export default appWithTranslation(App);
