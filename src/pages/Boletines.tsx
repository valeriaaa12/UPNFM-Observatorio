import Boletin from "@/cards/Boletin"
export default function Boletines() {
  return (
    <>
       <div className="font">
        <div className="container-boletin">
          <h2 >Boletines</h2>
        </div>
          <div id="Boletines" className="card-gallery">
            <Boletin 
              title= "Boletin 1"
              pdf= "/Boletin_1_Observatorio_educativo_UPNFM.pdf"
            />
            <Boletin 
              title= "Boletin 2"
              pdf= "/Boletin_2_Observatorio_educativo_UPNFM.pdf"
            />
            <Boletin 
              title= "Boletin 3"
              
              pdf= "/Boletin_3_Observatorio_educativo_UPNFM.pdf"
            />
            <Boletin 
              title= "Boletin 4"
              pdf= "/Boletin_4_Observatorio_educativo_UPNFM.pdf"
            />
            <Boletin 
              title= "Boletin 5"
              pdf= "/Boletín_No_5_Observatorio_Universitario_de_la_Educacion_Nacional_Internacional_UPNFM.pdf"
            />
            <Boletin 
              title= "Boletin 6"
              pdf= "/Boletín_No_6_Observatorio_Universitario_de_la_Educacion_Nacional_Internacional_UPNFM.pdf"
            />
            <Boletin 
              title= "Boletin 7"
              pdf= "/Boletín_No_7_Observatorio_Universitario_de_la_Educacion_Nacional_Internacional_UPNFM.pdf"
            />
            <Boletin 
              title= "Boletin 8"
              pdf= "/Boletín_No_8_Observatorio_Universitario_de_la_Educacion_Nacional_Internacional_UPNFM.pdf"
            />

          </div>
       </div>
    </>
    );
};