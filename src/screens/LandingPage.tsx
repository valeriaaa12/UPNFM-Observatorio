
import Head from "next/head";
import InfoCardsSegment from "@/sections/InfoCardsSegment";
import Carrusel from "@/sections/carrusel";
import Footer from "@/sections/footer";
export default function LandingPage() {
  return (
    <>
      <Carrusel></Carrusel>
      <InfoCardsSegment></InfoCardsSegment>
      <div id="redes" style={{ backgroundColor: "#19467f", paddingTop: "1%", paddingLeft: "1%" }}>
        <a href="https://www.facebook.com/share/1CHCMrxRrS/" target="_blank" rel="noopener noreferrer">
          <img src="/images/facebook.png" alt="Facebook" width="30rem" height="30rem" />
        </a>
        <a href="https://www.instagram.com/upnfmweb/?hl=es" target="_blank" rel="noopener noreferrer">
          <img src="/images/instagram.png" alt="Instagram" width="30rem" height="30rem" />
        </a>
        <a href="https://www.linkedin.com/company/upnfcomorazan/?originalSubdomain=hn" target="_blank" rel="noopener noreferrer">
          <img src="/images/linkedin.png" alt="LinkedIn" width="30rem" height="30rem" />
        </a>
        <a href="https://www.youtube.com/@upnfm-tv8269" target="_blank" rel="noopener noreferrer">
          <img src="/images/youtube.png" alt="YouTube" width="40rem" height="28rem" />
        </a>
      </div>
      <Footer></Footer>
    </>
  );
};

