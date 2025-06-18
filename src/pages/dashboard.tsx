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
    const [activeDepaTab, setDepaActiveTab] = useState("coberturaBruta");
    const [activeMuniTab, setMuniActiveTab] = useState("coberturaBruta");
    const [activeCompDepaTab, setCompDepaActiveTab] = useState("coberturaBruta");
    const [activeCompMuniTab, setCompMuniActiveTab] = useState("coberturaBruta");
    const [key, setKey] = useState(0);

    const depaTabsConfig = [
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

    const activeDepaTabConfig = depaTabsConfig.find(tab => tab.id === activeDepaTab) || depaTabsConfig[0];

    const muniTabsConfig = [
        {
            id: "coberturaBruta",
            label: "Cobertura (Tasa Bruta)",
            dataEndpoint: "/tasabrutaMunicipal",
            limitsEndpoint: "/limitesTasaBruta",
            titleKey: "TasaBruta"
        },
        {
            id: "coberturaNeta",
            label: "Cobertura (Tasa Neta)",
            dataEndpoint: "/tasanetaMunicipal",
            limitsEndpoint: "/limitesTasaNeta",
            titleKey: "TasaNeta"
        },
        {
            id: "aprobacion",
            label: "Aprobación",
            dataEndpoint: "/aprobacionMunicipal",
            limitsEndpoint: "/limitesAprobacion",
            titleKey: "Aprobacion"
        },
        {
            id: "desercion",
            label: "Deserción",
            dataEndpoint: "/desercionMunicipal",
            limitsEndpoint: "/limitesDesercion",
            titleKey: "Desercion"
        },
        {
            id: "repitencia",
            label: "Repitencia Municipal",
            dataEndpoint: "/repitenciaMunicipal",
            limitsEndpoint: "/limitesRepitencia",
            titleKey: "Repitencia"
        },
        {
            id: "reprobacion",
            label: "Reprobación",
            dataEndpoint: "/reprobacionMunicipal",
            limitsEndpoint: "/limitesReprobacion",
            titleKey: "Reprobacion"
        }
    ];
    const activeMuniTabConfig = muniTabsConfig.find(tab => tab.id === activeMuniTab) || muniTabsConfig[0];

    const compDepaTabsConfig = [
        {
            id: "coberturaBruta",
            label: "Cobertura (Tasa Bruta)",
            dataEndpoint: "/tasabrutaDepartamentos",
            lineDataEndpoint: "/tasaBrutaComparacion",
            limitsEndpoint: "/limitesTasaBruta",
            titleKey: "TasaBruta"
        },
        {
            id: "coberturaNeta",
            label: "Cobertura (Tasa Neta)",
            dataEndpoint: "/tasanetaDepartamentos",
            lineDataEndpoint: "//tasaNetaComparacion",
            limitsEndpoint: "/limitesTasaNeta",
            titleKey: "TasaNeta"
        },
        {
            id: "aprobacion",
            label: "Aprobación",
            dataEndpoint: "/aprobacionDepartamentos",
            lineDataEndpoint: "/aprobacionComparacion",
            limitsEndpoint: "/limitesAprobacion",
            titleKey: "Aprobacion"
        },
        {
            id: "desercion",
            label: "Deserción",
            dataEndpoint: "/desercionDepartamentos",
            lineDataEndpoint: "/desercionComparacion",
            limitsEndpoint: "/limitesDesercion",
            titleKey: "Desercion"
        },
        {
            id: "repitencia",
            label: "Repitencia",
            dataEndpoint: "/repitenciaDepartamentos",
            lineDataEndpoint: "/repitenciaComparacion",
            limitsEndpoint: "/limitesRepitencia",
            titleKey: "Repitencia"
        },
        {
            id: "reprobacion",
            label: "Reprobación",
            dataEndpoint: "/reprobacionDepartamentos",
            lineDataEndpoint: "/reprobacionComparacion",
            limitsEndpoint: "/limitesReprobacion",
            titleKey: "Reprobacion"
        }
    ];

    const activeCompDepaTabConfig = compDepaTabsConfig.find(tab => tab.id === activeCompDepaTab) || compDepaTabsConfig[0];

    const compMuniTabsConfig = [
        {
            id: "coberturaBruta",
            label: "Cobertura (Tasa Bruta)",
            dataEndpoint: "/tasaBrutaComparacionMunicipal",
            lineDataEndpoint: "/tasaBrutaComparacionMunicipalsf",
            limitsEndpoint: "/limitesTasaBruta",
            titleKey: "TasaBruta"
        },
        {
            id: "coberturaNeta",
            label: "Cobertura (Tasa Neta)",
            dataEndpoint: "/tasaNetaComparacionMunicipal",
            lineDataEndpoint: "/tasaNetaComparacionMunicipalsf",
            limitsEndpoint: "/limitesTasaNeta",
            titleKey: "TasaNeta"
        },
        {
            id: "aprobacion",
            label: "Aprobación",
            dataEndpoint: "/aprobacionComparacionMunicipal",
            lineDataEndpoint: "/aprobacionComparacionMunicipalsf",
            limitsEndpoint: "/limitesAprobacion",
            titleKey: "Aprobacion"
        },
        {
            id: "desercion",
            label: "Deserción",
            dataEndpoint: "/desercionComparacionMunicipal",
            lineDataEndpoint: "/desercionComparacionMunicipalsf",
            limitsEndpoint: "/limitesDesercion",
            titleKey: "Desercion"
        },
        {
            id: "repitencia",
            label: "Repitencia",
            dataEndpoint: "/repitenciaComparacionMunicipal",
            lineDataEndpoint: "/repitenciaComparacionMunicipalsf",
            limitsEndpoint: "/limitesRepitencia",
            titleKey: "Repitencia"
        },
        {
            id: "reprobacion",
            label: "Reprobación",
            dataEndpoint: "/reprobacionComparacionMunicipal",
            lineDataEndpoint: "/reprobacionComparacionMunicipalsf",
            limitsEndpoint: "/limitesReprobacion",
            titleKey: "Reprobacion"
        }
    ];

    const activeCompMuniTabConfig = compMuniTabsConfig.find(tab => tab.id === activeCompMuniTab) || compMuniTabsConfig[0];

    // Para departamentos
    const handleDepaTabChange = (selectedKey: string | null) => {
        if (selectedKey) {
            setDepaActiveTab(selectedKey);
            setKey(prevKey => prevKey + 1);
        }
    };
    // Para municipios
    const handleMuniTabChange = (selectedKey: string | null) => {
        if (selectedKey) {
            setMuniActiveTab(selectedKey);
            setKey(prevKey => prevKey + 1);
        }
    };
    // Para comparación entre departamentos
    const handleCompDepaTabChange = (selectedKey: string | null) => {
        if (selectedKey) {
            setCompDepaActiveTab(selectedKey);
            setKey(prevKey => prevKey + 1);
        }
    };

    // Para comparación entre municipios
    const handleCompMuniTabChange = (selectedKey: string | null) => {
        if (selectedKey) {
            setCompMuniActiveTab(selectedKey);
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
            {/* Indicadores Educativos - Departamentos */}
            <div className="font container-fluid fondoGris" style={{ padding: "3%" }}>
                <div style={{
                    backgroundColor: "white",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                    overflow: "hidden"
                }}>
                    <p className="p-3 form-text pb-0">
                        {t("Indicadores Educativos por Departamento")}
                    </p>
                    <Nav
                        variant="tabs"
                        activeKey={activeDepaTab}
                        onSelect={handleDepaTabChange}

                    >
                        {depaTabsConfig.map((tab) => (
                            <Nav.Item key={tab.id} >
                                <Nav.Link
                                    eventKey={tab.id}
                                    style={{
                                        backgroundColor: activeDepaTab === tab.id ? "#f8f9fa" : "white",
                                        fontWeight: activeDepaTab === tab.id ? "bold" : "normal"
                                    }}
                                    className="orangeText border-bottom"
                                >
                                    {tab.label}
                                </Nav.Link>
                            </Nav.Item>
                        ))}
                    </Nav>

                    <div className="mt-3">
                        <GraphScreen
                            key={key}
                            title={t(activeDepaTabConfig.label)}
                            extensionData={activeDepaTabConfig.dataEndpoint}
                            extensionLimits={activeDepaTabConfig.limitsEndpoint}
                            comparison={false}
                            department={true}
                        />
                    </div>
                </div>
            </div>

            {/* Indicadores Educativos - Municipios */}
            <div className="font container-fluid fondoGris" style={{ padding: "3%", paddingTop: "0" }}>
                <div style={{
                    backgroundColor: "white",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                    overflow: "hidden"
                }}>
                    <p className="p-3 form-text pb-0">
                        {t("Indicadores Educativos por Municipio")}
                    </p>
                    <Nav
                        variant="tabs"
                        activeKey={activeMuniTab}
                        onSelect={handleMuniTabChange}

                    >
                        {muniTabsConfig.map((tab) => (
                            <Nav.Item key={tab.id} >
                                <Nav.Link
                                    eventKey={tab.id}
                                    style={{
                                        backgroundColor: activeMuniTab === tab.id ? "#f8f9fa" : "white",
                                        fontWeight: activeMuniTab === tab.id ? "bold" : "normal"
                                    }}
                                    className="orangeText border-bottom"
                                >
                                    {tab.label}
                                </Nav.Link>
                            </Nav.Item>
                        ))}
                    </Nav>

                    <div className="mt-3">
                        <GraphScreen
                            key={key}
                            title={t(activeMuniTabConfig.label)}
                            extensionData={activeMuniTabConfig.dataEndpoint}
                            extensionLimits={activeMuniTabConfig.limitsEndpoint}
                            comparison={false}
                            department={false}
                        />
                    </div>
                </div>

            </div>

            {/* Indicadores Educativos - Comparación Departamento */}
            <div className="font container-fluid fondoGris" style={{ padding: "3%", paddingTop: "0" }}>
                <div style={{
                    backgroundColor: "white",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                    overflow: "hidden"
                }}>
                    <p className="p-3 form-text pb-0">
                        {t("Comparación entre Departamentos")}
                    </p>
                    <Nav
                        variant="tabs"
                        activeKey={activeCompDepaTab}
                        onSelect={handleCompDepaTabChange}

                    >
                        {compDepaTabsConfig.map((tab) => (
                            <Nav.Item key={tab.id} >
                                <Nav.Link
                                    eventKey={tab.id}
                                    style={{
                                        backgroundColor: activeCompDepaTab === tab.id ? "#f8f9fa" : "white",
                                        fontWeight: activeCompDepaTab === tab.id ? "bold" : "normal"
                                    }}
                                    className="orangeText border-bottom"
                                >
                                    {tab.label}
                                </Nav.Link>
                            </Nav.Item>
                        ))}
                    </Nav>

                    <div className="mt-3">
                        <GraphScreen
                            key={key}
                            title={t(activeCompDepaTabConfig.label)}
                            extensionData={activeCompDepaTabConfig.dataEndpoint}
                            extensionLineData={activeCompDepaTabConfig.lineDataEndpoint}
                            extensionLimits={activeCompDepaTabConfig.limitsEndpoint}
                            comparison={true}
                            department={true}
                        />
                    </div>
                </div>
            </div>

            {/* Indicadores Educativos - Comparación Municipios */}
            <div className="font container-fluid fondoGris" style={{ padding: "3%", paddingTop: "0" }}>
                <div style={{
                    backgroundColor: "white",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                    overflow: "hidden"
                }}>
                    <p className="p-3 form-text pb-0">
                        Comparación entre Municipios
                    </p>
                    <Nav
                        variant="tabs"
                        activeKey={activeCompMuniTab}
                        onSelect={handleCompMuniTabChange}

                    >
                        {compMuniTabsConfig.map((tab) => (
                            <Nav.Item key={tab.id} >
                                <Nav.Link
                                    eventKey={tab.id}
                                    style={{
                                        backgroundColor: activeCompMuniTab === tab.id ? "#f8f9fa" : "white",
                                        fontWeight: activeCompMuniTab === tab.id ? "bold" : "normal"
                                    }}
                                    className="orangeText border-bottom"
                                >
                                    {tab.label}
                                </Nav.Link>
                            </Nav.Item>
                        ))}
                    </Nav>

                    <div className="mt-3">
                        <GraphScreen
                            key={key}
                            title={t(activeCompMuniTabConfig.label)}
                            extensionData={activeCompMuniTabConfig.dataEndpoint}
                            extensionLineData={activeCompMuniTabConfig.lineDataEndpoint}
                            extensionLimits={activeCompMuniTabConfig.limitsEndpoint}
                            comparison={true}
                            department={false}
                        />
                    </div>
                </div>
                <div style={{
                    textAlign: 'center',
                    fontSize: '0.8rem',
                    color: '#666',
                    padding: '10px 0',
                    paddingTop: "3%",
                    paddingBottom: "0"
                }}>
                    © {new Date().getFullYear()} observatorio.upnfm.edu.hn Todos los derechos reservados
                    <br></br><br></br>
                    La información y los formatos presentados en este dashboard están protegidos por derechos de autor y son propiedad exclusiva del Observatorio Universitario de la Educación Nacional e Internacional (OUDENI) de la UPNFM de Honduras (observatorio.upnfm.edu. hn). El uso de esta información está únicamente destinado a fines educativos, de investigación y para la toma de decisiones. El OUDENI-UPNFM no se responsabiliza por el uso indebido de los datos aquí proporcionados.
                </div>
            </div>
            <LanguageSelector />
            <Footer />
        </Client>
    );
}