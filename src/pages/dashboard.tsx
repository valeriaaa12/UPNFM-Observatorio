import Footer from "@/sections/footer";
import Nav from 'react-bootstrap/Nav';
import ImgOverlay from "@/components/imageOverlay";
import LanguageSelector from "@/buttons/LanguageSelector";
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import Client from "@/components/client";
import NavBar from "@/navigation/NavBar";
import SmallNavBar from "@/navigation/SmallNavBar";
import GraphScreen from "../screens/graphscreen";

export default function Dashboard() {
    const { t } = useTranslation('common');
    const [activeTab, setActiveTab] = useState("coberturaBruta");
    const [key, setKey] = useState(0);

    const tabsConfig = [
        {
            id: "coberturaBruta",
            label: "Cobertura (Tasa Bruta)",
            dataEndpoint: "/tasabruta",
            limitsEndpoint: "/limitesTasaBruta",
            titleKey: "TasaBruta"
        },
        {
            id: "coberturaNeta",
            label: "Cobertura (Tasa Neta)",
            dataEndpoint: "/tasaneta",
            limitsEndpoint: "/limitesTasaNeta",
            titleKey: "TasaNeta"
        },
        {
            id: "aprobacion",
            label: "Aprobación",
            dataEndpoint: "/aprobacion",
            limitsEndpoint: "/limitesAprobacion",
            titleKey: "Aprobacion"
        },
        {
            id: "desercion",
            label: "Deserción",
            dataEndpoint: "/desercion",
            limitsEndpoint: "/limitesDesercion",
            titleKey: "Desercion"
        },
        {
            id: "repitencia",
            label: "Repitencia",
            dataEndpoint: "/repitencia",
            limitsEndpoint: "/limitesRepitencia",
            titleKey: "Repitencia"
        },
        {
            id: "reprobacion",
            label: "Reprobación",
            dataEndpoint: "/reprobacion",
            limitsEndpoint: "/limitesReprobacion",
            titleKey: "Reprobacion"
        }
    ];

    const activeTabConfig = tabsConfig.find(tab => tab.id === activeTab) || tabsConfig[0];

    // Maneja el cambio de tab
    const handleTabChange = (selectedKey: string | null) => {
        if (selectedKey) {
            setActiveTab(selectedKey);
            setKey(prevKey => prevKey + 1);
        }
    };

    return (
        <Client>
            <LanguageSelector />
            <div className="backgroundNavbar navbarSpacing">
                <NavBar />
            </div>
            <SmallNavBar />
            <ImgOverlay image="images/estadisticas4.jpg" text="Gráficos Estadísticos" bottom={true} />
            <div className="font fondoGris container-fluid p-4">
                <div style={{ backgroundColor: "white" }}>
                    <Nav
                        variant="tabs"
                        activeKey={activeTab}
                        onSelect={handleTabChange}
                    >
                        {tabsConfig.map((tab) => (
                            <Nav.Item key={tab.id}>
                                <Nav.Link
                                    eventKey={tab.id}
                                    className="blueText"
                                    style={{
                                        backgroundColor: activeTab === tab.id ? "#f8f9fa" : "white",
                                        fontWeight: activeTab === tab.id ? "bold" : "normal"
                                    }}
                                >
                                    {tab.label}
                                </Nav.Link>
                            </Nav.Item>
                        ))}
                    </Nav>

                    <div className="mt-3">
                        <GraphScreen
                            key={key}
                            title={t(activeTabConfig.label)}
                            extensionData={activeTabConfig.dataEndpoint}
                            extensionLimits={activeTabConfig.limitsEndpoint}
                        />
                    </div>
                </div>
            </div>
            <Footer />
        </Client>
    );
}