import MapScreen from "@/screens/mapscreen";
import Client from "@/components/client";

export default function RepitenciaScreen(){
    return(<>
        <Client>
        <MapScreen extensionData="/repitencia" extensionLimits="/limitesRepitencia" title="Tasa de Repitencia Escolar en Honduras"></MapScreen>
        </Client>
    </>);
}