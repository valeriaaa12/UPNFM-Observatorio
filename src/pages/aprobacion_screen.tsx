import MapScreen from "@/screens/mapscreen";
import Client from "@/components/client";

export default function AprobacionScreen(){
    return(<>
        <Client>
            <MapScreen extensionData="/aprobacion" extensionLimits="/limitesAprobacion" title="Tasa de Aprobación Escolar en Honduras"></MapScreen>
        </Client>
    </>);
}