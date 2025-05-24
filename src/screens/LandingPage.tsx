import InfoCardsSegment from "@/sections/InfoCardsSegment";
import Carrusel from "@/sections/carrusel";
import SmallNavBar from "@/navigation/SmallNavBar";
import ImgOverlay from "@/components/imageOverlay";
import NavBar from "@/navigation/NavBar";
import Footer from "@/sections/footer";
import What from "@/sections/what";

export default function LandingPage() {
  return (
    <>
      <div className="backgroundNavbar navbarSpacing">
      <NavBar></NavBar>
      
      </div>
      <SmallNavBar></SmallNavBar>
      <div className="imageContainer">
                <div className="imageOverlay" />
                <div className="overlayText">
                    <p className="bigTitle">UPNFM</p>
                  
                </div>
      </div>
      <ImgOverlay image="images/fondo2.jpg" text="OBSERVATORIO UNIVERSITARIO DE LA EDUCACIÓN NACIONAL E INTERNACIONAL (OUDENI)" bottom={true} />
      <What></What>
      <Carrusel></Carrusel>
      <InfoCardsSegment></InfoCardsSegment>
      <Footer></Footer>
    </>
  );
};

