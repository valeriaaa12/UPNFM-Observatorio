
import Head from "next/head";
import InfoCardsSegment from "@/sections/InfoCardsSegment";
import Carrusel from "@/sections/carrusel";

import NavBar from "@/navigation/NavBar";
import Footer from "@/sections/footer";
export default function LandingPage() {
  return (
    <>
      <div className="backgroundNavbar navbarSpacing">
      <NavBar></NavBar>
      </div>
      <div className="imageContainer">
                <div className="imageOverlay" />
                <div className="overlayText">
                    <p className="bigTitle">UPNFM</p>
                  
                </div>
      </div>
      <Carrusel></Carrusel>
      <InfoCardsSegment></InfoCardsSegment>
      <Footer></Footer>
    </>
    );
};

