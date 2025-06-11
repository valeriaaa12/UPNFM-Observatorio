import MapScreen from "@/screens/mapscreen";
import Client from "@/components/client";
import { useTranslation } from 'react-i18next';
export default function RepitenciaScreen(){
    const { t, i18n } = useTranslation('common');
    return(<>
        <Client>
        <MapScreen extensionData="/repitenciaFiltro" extensionLimits="/limitesRepitencia" title={t('TasaRepitencia')}></MapScreen>
        </Client>
    </>);
}