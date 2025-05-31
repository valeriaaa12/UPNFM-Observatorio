import MapScreen from "@/screens/mapscreen";
import Client from "@/components/client";

export default function DesercionScreen(){
    return(<>
        <Client>
        <MapScreen extensionData="/desercion" extensionLimits="/limitesDesercion" title="Tasa de Deserción Escolar en Honduras"></MapScreen>
        </Client>
    </>);
}