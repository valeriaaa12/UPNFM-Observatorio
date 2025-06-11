import InfoCardsSegment from "@/sections/InfoCardsSegment";
import Carrusel from "@/sections/carrusel";
import SmallNavBar from "@/navigation/SmallNavBar";
import ImgOverlay from "@/components/imageOverlay";
import NavBar from "@/navigation/NavBar";
import Footer from "@/sections/footer";
import What from "@/sections/what";
import LanguageSelector from "@/buttons/LanguageSelector";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import Client from "@/components/client";
import Cookies from "@/components/cookies";
export default function LandingPage() {
    const { t } = useTranslation();
    const [cookies, setCookies] = useCookies(["cookieConsent"]);
    const [showLanguageSelector, setShowLanguageSelector] = useState(false);
    const [cookiesClosed, setCookiesClosed] = useState(false);

    useEffect(() => {
        if (cookies.cookieConsent || cookiesClosed) {
            setShowLanguageSelector(true);
        }
    }, [cookies.cookieConsent, cookiesClosed]);

    return (
        <Client>
            <div className="backgroundNavbar navbarSpacing">
                <NavBar />
            </div>
            <SmallNavBar />
            {!cookies.cookieConsent && !cookiesClosed && (
                <Cookies onClose={() => setCookiesClosed(true)} />
            )}
            {showLanguageSelector && <LanguageSelector />}
            <ImgOverlay image="images/fondo2.jpg" text={`${t("OUDENI")}(OUDENI)`} bottom={true} />
            <What />
            <Carrusel />
            <InfoCardsSegment />
            <Footer />
        </Client>
    );
}