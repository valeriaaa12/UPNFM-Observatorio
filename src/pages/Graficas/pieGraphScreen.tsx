import Client from "@/components/client";
import GraphScreen from "../../screens/piegraphscreen";

import { useTranslation } from 'react-i18next';
export default function ReprobacionScreen() {
    const { t, i18n } = useTranslation('common');
    return (<>
        <Client>
            <GraphScreen title={t('TasaDesercion')} extensionData="/desercion" extensionLimits="/limitesDesercion" />
        </Client>
    </>);
}