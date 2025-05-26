import Boletin from "@/pages/cards/Boletin"
import Footer from "@/sections/footer";
import NavBar from "@/navigation/NavBar"
import SmallNavBar from "@/navigation/SmallNavBar"

export default function Datos_Municipales() {
  return (
    <>
      <div className="font">
        <div className="blue blueNavbar">
          <NavBar />
          <div className="orange d-none d-md-block" style={{ height: "0.5rem" }} />
        </div>
        <SmallNavBar />
        <p className="fontSection p-5">Datos Municipales</p>
        <div  className="card-gallery pt-0 Boletines">
          <Boletin
            title="Boletín 1"
            pdf="/Boletin_1_Observatorio_educativo_UPNFM.pdf"
          />
        </div>
      </div>
      <Footer />
    </>
  );
};