
import Head from "next/head";
import InfoCardsSegment from "@/sections/InfoCardsSegment";
import Carrusel from "@/sections/carrusel";
import Footer from "@/sections/footer";
import What from "@/sections/what";
export default function LandingPage() {
  return (
    <>
      <Carrusel></Carrusel>
      <InfoCardsSegment></InfoCardsSegment>
      <What></What>
      <Footer></Footer>
    </>
    );
};

