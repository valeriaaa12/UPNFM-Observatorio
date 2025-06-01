import MapScreen from "@/screens/mapscreen";
import Client from "@/components/client";
export default function CoberturaNetaScreen(){
    return(<>
        <Client>
        <MapScreen extensionData="/tasaneta" extensionLimits="/limitesTasaNeta" title="Tasa de Cobertura Neta Escolar en Honduras"></MapScreen>
        </Client>
    </>);
}

