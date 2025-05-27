
import NavBar from "@/navigation/NavBar";
import dynamic from 'next/dynamic';

import HondurasMap from "@/maps/HondurasMap";
export default function MapScreen(){
    return(
        <>
       
            <NavBar></NavBar>
           <HondurasMap></HondurasMap>
        </>
    );
}