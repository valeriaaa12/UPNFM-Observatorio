import InfoCardsSegment from "@/sections/InfoCardsSegment";
import Carrusel from "@/sections/carrusel";
import FrontPage from "@/components/imageOverlay"
import NavBar from "@/navigation/NavBar";
import Footer from "@/sections/footer";
export default function LandingPage() {
  return (
    <>
      <div className="backgroundNavbar navbarSpacing">
        <NavBar />
      </div>
      <FrontPage image="images/fondo2.jpg" text="OBSERVATORIO UNIVERSITARIO DE LA EDUCACIÓN NACIONAL E INTERNACIONAL (OUDENI)" />
      <Carrusel></Carrusel>
      <InfoCardsSegment></InfoCardsSegment>
      <Footer />
    </>
  );
};

