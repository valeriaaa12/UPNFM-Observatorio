import Boletin from "@/pages/cards/Boletin"
import Footer from "@/sections/footer";
import NavBar from "@/navigation/NavBar"
import SmallNavBar from "@/navigation/SmallNavBar"

export default function Boletines() {
  return (
    <>
      <div className="font">
        <div className="blue blueNavbar">
          <NavBar />
          <div className="orange d-none d-md-block" style={{ height: "0.5rem" }} />
        </div>
        <SmallNavBar />
        <div className="d-flex justify-content-between align-items-center px-5 py-4">
          <p className="fontSection m-0">Boletines</p>
          <button className="btn btn-primary">Nuevo Boletín</button>
        </div>

        <div  className="card-gallery pt-0 Boletines">
          <Boletin
            title="Boletín 1"
            pdf="/Boletin_1_Observatorio_educativo_UPNFM.pdf"
          />
          <Boletin
            title="Boletín 2"
            pdf="/Boletin_2_Observatorio_educativo_UPNFM.pdf"
          />
          <Boletin
            title="Boletín 3"
            pdf="/Boletin_3_Observatorio_educativo_UPNFM.pdf"
          />
          <Boletin
            title="Boletín 4"
            pdf="/Boletin_4_Observatorio_educativo_UPNFM.pdf"
          />
          <Boletin
            title="Boletín 5"
            pdf="/Boletín_No_5_Observatorio_Universitario_de_la_Educacion_Nacional_Internacional_UPNFM.pdf"
          />
          <Boletin
            title="Boletín 6"
            pdf="/Boletín_No_6_Observatorio_Universitario_de_la_Educacion_Nacional_Internacional_UPNFM.pdf"
          />
          <Boletin
            title="Boletín 7"
            pdf="/Boletín_No_7_Observatorio_Universitario_de_la_Educacion_Nacional_Internacional_UPNFM.pdf"
          />
          <Boletin
            title="Boletín 8"
            pdf="/Boletín_No_8_Observatorio_Universitario_de_la_Educacion_Nacional_Internacional_UPNFM.pdf"
          />
        </div>
      </div>
      <Footer />
    </>
  );
};