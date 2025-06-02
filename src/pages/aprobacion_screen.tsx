import MapScreen from "@/screens/mapscreen";
import Client from "@/components/client";
import { useTranslation } from 'react-i18next';
export default function AprobacionScreen(){
    const { t, i18n } = useTranslation('common');   
    return(<>
        <Client>
            <MapScreen extensionData="/aprobacion" extensionLimits="/limitesAprobacion" title={t('TasaAprobacion')}></MapScreen>
        </Client>
    </>);
}