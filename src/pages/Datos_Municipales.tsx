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
            title="Datos Prebasica tasa de desercion"
            pdf="/1.1-Tasa-de-Desercion-Pre-Basica-a-nivel-Municipal-2018_2023_-RHR-oct-2024.pdf"
          />
        </div>
      </div>
      <Footer />
    </>
  );
};