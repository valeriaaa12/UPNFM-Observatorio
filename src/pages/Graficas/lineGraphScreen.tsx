import Client from "@/components/client";
import LineGraphScreen from "../../screens/LineGraphScreen";

import { useTranslation } from 'react-i18next';
export default function ReprobacionScreen() {
    const { t, i18n } = useTranslation('common');
    return (<>
        <Client>
            <LineGraphScreen title={t('TasaDesercion')} extensionData="/desercion" extensionLimits="/limitesDesercion" />
        </Client>
    </>);
}