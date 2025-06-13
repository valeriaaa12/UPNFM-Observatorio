import MapScreen from "@/screens/mapscreen";
import Client from "@/components/client";
import { useTranslation } from 'react-i18next';
export default function DesercionScreen(){
    const { t, i18n } = useTranslation('common');
    return(<>
        <Client>
        <MapScreen extensionData="/desercionFiltro" extensionLimits="/limitesDesercion" title={t('TasaDesercion')}></MapScreen>
        </Client>
    </>);
}