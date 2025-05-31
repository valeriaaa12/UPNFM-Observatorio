 import Card from "@/cards/teamCard"
import HCard from "@/cards/horizontalCard"
import Footer from "@/sections/footer";
import NavBar from "@/navigation/NavBar"
import SmallNavBar from "@/navigation/SmallNavBar"
import ImgOverlay from "@/components/imageOverlay";
import LanguageSelector from "@/buttons/LanguageSelector";
import { useTranslation } from 'react-i18next';
export default function aboutUs() {
     const { t, i18n } = useTranslation('common');  
    return (
        <>
        <LanguageSelector></LanguageSelector>
            <div className="backgroundNavbar navbarSpacing">
                <NavBar />
            </div>
            <SmallNavBar />
            <ImgOverlay image="images/AboutUs.png" text={t("Sobre Nosotros")} center={true} />
            <div id="aboutUs" className="font container-fluid px-3 px-md-5 py-4">
                {/* Misión y Visión */}
                <div className="row g-4">
                    <div className="col-12 col-lg-6">
                        <HCard
                            image="images/mision.jpg"
                            title={t("Mision")}
                            text={t("MisionB")}
                        />
                    </div>
                    <div className="col-12 col-lg-6">
                        <HCard
                            image="images/vision2.jpg"
                            title={t("Vision")}
                            text={t("VisionB")}
                        />
                    </div>

                    {/*<div className="col-sm-4 mb-3 d-flex">
                        <div className="card" style={{
                            width: "18rem",
                            boxShadow: "-20px 20px 0 #FE5000",
                        }}>
                            <BasicCard
                                title="Misión"
                                text="Recoger, sistematizar, analizar y proveer datos educativos que contribuyan al mejoramiento continuo de la calidad de la educación, en Honduras y en la región."
                            />
                        </div>
                    </div >

                    <div className="col-sm-4 mb-3 d-flex">
                        <div className="card" style={{
                            width: "18rem",
                            boxShadow: "-20px 20px 0 #003DA5",
                        }}>
                            <BasicCard
                                title="Visión"
                                text="Ser un ente que proporcione al sistema educativo hondureño, herramientas, datos, información e investigaciones que se usen para la toma de decisiones a nivel administrativo y ejecutivo."
                            />
                        </div>
                    </div >

                    <div className="col-sm-4 mb-3 d-flex">
                        <div className="card" style={{
                            width: "24rem",
                            boxShadow: "-20px 20px 0 #FEDD00",
                        }}>
                            <BasicCard
                                title="Objetivos"
                                objectives={[
                                    "Gestionar conocimientos científicos que aporten a la resolución de problemas en el campo educativo a nivel local, departamental, regional, nacional e internacional.",
                                    "Generar y promover la difusión y administración del conocimiento educativo para que esté disponible y sea accesible a los actores del sistema educativo.",
                                    "Monitorear permanentemente los indicadores educativos seleccionados, con el fin de apoyar el diseño, la implementación y la evaluación de políticas públicas en educación."
                                ]}
                            />
                        </div>
                    </div >*/}
                </div>

                <hr className="my-4" />

                {/* Objetivos */}
                <div className="card mb-4 border-0 shadow-0">
                    <div className="row g-0">
                        <div className="col-md-3 mb-3 mb-md-0">
                            <img
                                src="images/objetivos.jpg"
                                alt={t("Objetivos")}
                                className="img-fluid rounded-start h-100 w-100 object-fit-cover"
                                style={{ objectFit: "cover", objectPosition: "center" }}
                            />
                        </div>
                        <div className="col-md-9">
                            <div className="card-body">
                                <h5 className="cardTitle orangeText">{t("Objetivos")}</h5>
                                <ul className="list-unstyled ps-0 ps-md-3">
                                    <li className="mb-3 d-flex">
                                        <span className="me-2">•</span>
                                        <span>{t("Ob1")}</span>
                                    </li>
                                    <li className="mb-3 d-flex">
                                        <span className="me-2">•</span>
                                        <span>{t("Ob2")}</span>
                                    </li>
                                    <li className="d-flex">
                                        <span className="me-2">•</span>
                                        <span>{t("Ob3")}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

            </div >

            {/*<div className="row">
                <div id="ourTeam" className="fondoGris disposicion">
                    <img src="images/Russbel-Hernandez.png" alt="" className="circle-img mx-auto d-block" />
                    <div className="informacion">
                        <div className="pb-3">
                            <p className="orangeText fw-bold fst-italic mb-1" style={{ fontSize: "3rem" }}>Russbel Hernández</p>
                            <p className="fst-italic fw-bold">Director del Instituto de Investigación y Evaluación Educativas y Sociales (INIEES), de la UPNFM.</p>
                        </div>
                        <p>El Dr. Russbel Hernández es Doctor en Economía por la Universidad de Flensburg, Alemania. Posee una Maestría en Política Económica con énfasis en Economía Ecológica y Desarrollo Sostenible, otorgada por la Universidad Nacional de Heredia, Costa Rica. Además, cuenta con una formación como Profesor de Educación Media con Licenciatura en Matemáticas y orientación en Computación, por la Universidad Pedagógica Nacional Francisco Morazán (UPNFM) de Honduras. Su trayectoria combina una sólida base académica con una profunda vocación por la educación y el desarrollo sostenible.</p>
                    </div>
                </div>

                <div id="ourTeam" className="disposicion">
                    <div className="informacion">
                        <div className="pb-3">
                            <p className="orangeText fw-bold fst-italic mb-1" style={{ fontSize: "3rem" }}>Russbel Hernández</p>
                            <p className="fst-italic fw-bold">Director del Instituto de Investigación y Evaluación Educativas y Sociales (INIEES), de la UPNFM.</p>
                        </div>
                        <p>El Dr. Russbel Hernández es Doctor en Economía por la Universidad de Flensburg, Alemania. Posee una Maestría en Política Económica con énfasis en Economía Ecológica y Desarrollo Sostenible, otorgada por la Universidad Nacional de Heredia, Costa Rica. Además, cuenta con una formación como Profesor de Educación Media con Licenciatura en Matemáticas y orientación en Computación, por la Universidad Pedagógica Nacional Francisco Morazán (UPNFM) de Honduras. Su trayectoria combina una sólida base académica con una profunda vocación por la educación y el desarrollo sostenible.</p>
                    </div>
                    <img src="images/Russbel-Hernandez.png" alt="" className="circle-img mx-auto d-block" />
                </div>
            </div>*/}

            {/* Nuestro Equipo */}
            <div id="ourTeam" className="font fondoGris container-fluid px-3 px-md-5 py-5">
                <p className="blueText mb-5 fontSection">{t("Nuestro Equipo")}</p>
                <div className="row g-4 justify-content-center">
                    <div className="col-12 col-sm-6 col-lg-3 d-flex justify-content-center">
                        <Card
                            image="images/Russbel-Hernandez.png"
                            title="Russbel Hernández"
                            role={t("RH")}
                            email="russbelh@upnfm.edu.hn"
                            studies={[
                                {
                                    grado: t("RHG"),
                                    institucion: t("RHI")
                                },
                                {
                                    grado: t("RHG2"),
                                    institucion: t("RHI2")
                                },
                                {
                                    grado: t("RHG3"),
                                    institucion: "UPNFM"
                                }
                            ]}
                        />
                    </div>

                    <div className="col-12 col-sm-6 col-lg-3 d-flex justify-content-center">
                        <Card
                            image="images/Mario Alas.png"
                            title="Mario Alas"
                            role={t("MA")}
                            email="marioalas@upnfm.edu.hn"
                            studies={[
                                {
                                    grado: t("RHG"),
                                    institucion: t("RHI")
                                },
                                {
                                    grado: t("RHG2"),
                                    institucion: t("RHI2")
                                },
                                {
                                    grado:t("RHG3"),
                                    institucion: "UPNFM"
                                }
                            ]}
                            experience={[
                               t("MAE1"),
                               t("MAE2")
                            ]}
                        />
                    </div>

                    <div className="col-12 col-sm-6 col-lg-3 d-flex justify-content-center">
                        <Card
                            image="images/German Moncada.png"
                            title="German Moncada"
                            role={t("GM")}
                            email="germanmoncada@upnfm.edu.hn"
                            studies={[
                                {
                                    grado : t("RHG"),
                                    institucion: t("RHI")
                                },
                                {
                                    grado: t("RHG2"),
                                    institucion: t("RHI2")
                                },
                                {
                                     grado:t("RHG3"),
                                    institucion: "UPNFM"
                                }
                            ]}
                            experience={[
                                t("GME1"),
                                t("GME2")
                            ]}
                        />
                    </div>

                    <div className="col-12 col-sm-6 col-lg-3 d-flex justify-content-center">
                        <Card
                            image="https://b2472105.smushcdn.com/2472105/wp-content/uploads/2023/09/Poses-Perfil-Profesional-Mujeres-ago.-10-2023-1-819x1024.jpg?lossy=1&strip=1&webp=1"
                            title="Claudia ---"
                            role={t("Claudia")}
                            email="germanmoncada@upnfm.edu.hn"
                            studies={[
                                {
                                    grado : t("RHG"),
                                    institucion: t("RHI")
                                },
                                {  
                                    grado: t("RHG2"),
                                    institucion: t("RHI2")
                                },
                                {
                                    grado:t("RHG3"),
                                    institucion: "UPNFM"
                                }
                            ]}
                            experience={[
                                t("ClaudiaE1"),
                                t("ClaudiaE2")
                            ]}
                        />
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};