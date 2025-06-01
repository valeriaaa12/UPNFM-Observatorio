import dynamic from 'next/dynamic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticPropsContext } from 'next';
import Client from '@/components/client';
const MapScreen = dynamic(() => import("@/screens/mapscreen"), {
  ssr: false
});

export default function CoberturaBrutaScreen(){
    return(<>
        <Client>
        <MapScreen extensionData="/tasabruta" extensionLimits="/limitesTasaBruta" title="Tasa de Cobertura Bruta Escolar en Honduras"></MapScreen>
        </Client>
    </>);
}
