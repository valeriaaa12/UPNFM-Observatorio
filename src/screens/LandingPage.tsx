
import Head from "next/head";
import InfoCardsSegment from "@/sections/InfoCardsSegment";
import Carrusel from "@/sections/carrusel";
import Footer from "@/sections/footer";
export default function LandingPage() {
  return (
    <>
      <Carrusel></Carrusel>
      <InfoCardsSegment></InfoCardsSegment>
      <Footer></Footer>
    </>
    );
};

