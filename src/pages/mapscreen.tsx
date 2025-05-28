
import NavBar from "@/navigation/NavBar";
import dynamic from 'next/dynamic';
import HondurasMap from "@/maps/HondurasMap";


const MainMap = dynamic(() => import("@/maps/MainMap"), {
  ssr: false
});


export default function MapScreen(){
    return(
        <>
       
            <div className="font">
                    <div className="blue blueNavbar">
                      <NavBar />
                      <div className="orange d-none d-md-block" style={{ height: "0.5rem" }} />
                    </div>
           {/*<HondurasMap></HondurasMap>*/}
           <MainMap></MainMap>
           </div>
        </>
    );
}