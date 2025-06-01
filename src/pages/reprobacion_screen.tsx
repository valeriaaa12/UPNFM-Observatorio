import MapScreen from "@/screens/mapscreen";
import Client from "@/components/client";

export default function ReprobacionScreen(){
    return(<>
        <Client>
            <MapScreen extensionData="/reprobacion" extensionLimits="/limitesReprobacion" title="Tasa de Reprobación Escolar en Honduras"></MapScreen>
        </Client>
    </>);
}