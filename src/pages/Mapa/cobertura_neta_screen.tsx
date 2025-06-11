import MapScreen from "@/screens/mapscreen";
import Client from "@/components/client";
import { useTranslation } from 'react-i18next';
export default function CoberturaNetaScreen(){
    const { t, i18n } = useTranslation('common');
    return(<>
        <Client>
        <MapScreen extensionData="/tasanetaFiltro" extensionLimits="/limitesTasaNeta" title={t('CoberturaNeta')}></MapScreen>
        </Client>
    </>);
}

