import dynamic from 'next/dynamic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticPropsContext } from 'next';
import Client from '@/components/client';
import { useTranslation } from 'react-i18next';

const MapScreen = dynamic(() => import("@/screens/mapscreen"), {
  ssr: false
});

export default function CoberturaBrutaScreen(){
   const { t, i18n } = useTranslation('common');
    return(<>
        <Client>
        <MapScreen extensionData="/tasabruta" extensionLimits="/limitesTasaBruta" title={t('CoberturaBruta')}></MapScreen>
        </Client>
    </>);
}
