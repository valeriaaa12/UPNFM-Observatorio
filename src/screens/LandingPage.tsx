import InfoCardsSegment from "@/sections/InfoCardsSegment";
import Carrusel from "@/sections/carrusel";
import SmallNavBar from "@/navigation/SmallNavBar";
import ImgOverlay from "@/components/imageOverlay";
import NavBar from "@/navigation/NavBar";
import Footer from "@/sections/footer";
import What from "@/sections/what";
import LanguageSelector from "@/buttons/LanguageSelector";
import { useTranslation } from "react-i18next";
import {useState, useEffect} from 'react';
import Client from "@/components/client";
export default function LandingPage() {
  const { t } = useTranslation();

  return (
    <>
    <Client>
      <div className="backgroundNavbar navbarSpacing">
        <NavBar></NavBar>
      
      </div>
      <SmallNavBar></SmallNavBar>
      
      <LanguageSelector></LanguageSelector>
      <ImgOverlay image="images/fondo2.jpg" text={`${t("OUDENI")}(OUDENI)`} bottom={true} />
      <What></What>
      <Carrusel></Carrusel>
      <InfoCardsSegment></InfoCardsSegment>
      <Footer></Footer>
      </Client>
    </>
  );
};

