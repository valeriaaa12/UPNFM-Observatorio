import MapScreen from "@/screens/mapscreen";
import Client from "@/components/client";

import { useTranslation } from 'react-i18next';
export default function ReprobacionScreen(){
    const { t, i18n } = useTranslation('common');
    return(<>
        <Client>
            <MapScreen extensionData="/reprobacionFiltro" extensionLimits="/limitesReprobacion" title={t('TasaReprobacion')}></MapScreen>
        </Client>
    </>);
}