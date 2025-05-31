import "@/styles/globals.css";
import "@/styles/styles.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import type { AppProps } from "next/app";
import { I18nextProvider } from 'react-i18next';
import i18n from "@/translations/i18n";
import I18nClient from "@/translations/i18n-client";
export default function App({ Component, pageProps }: AppProps) {
  return (
    
    <I18nextProvider i18n={i18n}>
      
      <Component {...pageProps} />
    </I18nextProvider>
  
 
  );
}
